import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import {
  FormControl,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Image } from '@/components/ui/image';
import { Input, InputField /*, InputIcon, InputSlot*/ } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';

export default function SignIn() {
  const router = useRouter();
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  // Configure Google Sign-In once
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  async function checkOnboardingStatus(userId: string) {
    const { data, error } = await supabase
      .from('profile')
      .select('onboarded')
      .eq('id', userId)
      .single();

    if (error || !data) {
      router.push('/getting-started');
      return;
    }

    if (data.onboarded) {
      router.push('/(tabs)/home');
    } else {
      router.push('/getting-started');
    }
  }

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message == "missing email or phone")
        Alert.alert('Sign In Error', 'Please enter email and password.');
      else if (error.message == "Email not confirmed") {
        // Email verification
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        if (resendError) {
          Alert.alert('Error', 'Failed to send verification email. Please try again.');
        } else {
          Alert.alert('Email Not Verified', 'We\'ve sent a verification link to your email. Please verify before signing in.');
        }

        router.push({
          pathname: '/verify-email',
          params: { email },
        });
        return;
      }
      else if (error.message == "Invalid login credentials")
        Alert.alert('Sign In Error', 'Invalid email or password.');
      else
        Alert.alert('Sign In Error', error.message);
      return;

    } else {
      const user = data.user ?? data.session?.user;

      if (user) {
        // set username if empty
        const { error: updateError } = await supabase
          .from('profile')
          .update({ username })
          .eq('id', user.id);

        if (updateError) {
          Alert.alert('Profile Error', updateError.message);
          return;
        }

        await checkOnboardingStatus(user.id);
      }
    }
  }

  async function ensureProfile(userId: string, defaultUsername?: string | null) {
    // check if profile exists
    const { data, error } = await supabase
      .from('profile')
      .select('id')
      .eq('id', userId)
      .single();

    if (!error && data) return;

    // create if missing
    const { error: insertError } = await supabase
      .from('profile')
      .insert({
        id: userId,
        username: defaultUsername ?? '',
        onboarded: false,
      });

    if (insertError) {
      Alert.alert('Profile Error', insertError.message);
      throw insertError;
    }
  }

  async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      const user = response.data?.user;

      if (!idToken) {
        Alert.alert('Google Sign-In Error', 'No ID token returned from Google.');
        return;
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        Alert.alert('Google Sign-In Error', error.message);
        console.log(error.message);
        return;
      }

      const authedUser = data.user ?? data.session?.user;
      if (!authedUser) {
        Alert.alert('Google Sign-In Error', 'No user returned from Supabase.');
        return;
      }

      await ensureProfile(authedUser.id, user?.name ?? authedUser.email ?? null);
      await checkOnboardingStatus(authedUser.id);
    } catch (err: any) {
      if (err?.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (err?.code === statusCodes.IN_PROGRESS) return;
      Alert.alert('Google Sign-In Error', err?.message || 'Unable to sign in with Google');
      console.log(err.message);
    }
  }

  async function signUpWithEmail() {
    setPasswordError('');

    if (!email || !password || !username) {
      Alert.alert('Registration Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('password')) {
        setPasswordError('Password must be at least 6 characters and include a-z, A-Z, and 0-9.');
      } else {
        Alert.alert('Registration Error', error.message);
      }
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profile')
        .insert({
          id: data.user.id,
          username: username,
          onboarded: false,
        });

      if (profileError) {
        Alert.alert('Profile Error', profileError.message);
        return;
      }
    }

    router.push({
      pathname: '/verify-email',
      params: { email },
    });
  }

  return (
    <View className="flex-1 bg-[#FFAE00]">
      <Image
        source={require('../../assets/images/full_icon.png')}
        className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-[120px] w-[260px] h-[260px] z-20"
        resizeMode="contain"
      />
      <View className="relative w-full flex-1 justify-end">
        <View className="w-full h-[80%] bg-white rounded-t-[30px] px-12 pt-[30%] pb-12 shadow-lg gap-3">
          <View className="">
            <Text size="2xl" style={{ fontFamily: 'Roboto-Bold' }}>
              {isRegister ? 'Register' : 'Sign In'}
            </Text>
          </View>

          {isRegister && (
            <FormControl className="gap-1">
              <FormControlLabelText>Username</FormControlLabelText>
              <Input>
                <InputField
                  placeholder="Username"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onChangeText={(text) => setUsername(text)}
                  value={username}
                />
              </Input>
            </FormControl>
          )}

          <FormControl className="gap-1">
            <FormControlLabelText>Email</FormControlLabelText>
            <Input>
              <InputField
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
            </Input>
          </FormControl>

          <FormControl className="gap-1">
            <FormControlLabelText>Password</FormControlLabelText>
            <Input>
              <InputField
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
            </Input>
            {passwordError ? (
              <FormControlHelperText>
                <Text className="text-error-500" style={{ fontFamily: 'Roboto-Regular' }}>
                  {passwordError}
                </Text>
              </FormControlHelperText>
            ) : null}
          </FormControl>

          {isRegister && (
            <FormControl className="gap-1">
              <FormControlLabelText>Confirm Password</FormControlLabelText>
              <Input>
                <InputField
                  placeholder="Confirm Password"
                  secureTextEntry
                  onChangeText={(text) => setConfirmPassword(text)}
                  value={confirmPassword}
                />
              </Input>
            </FormControl>
          )}


          <Button
            variant="solid"
            size="md"
            action="primary"
            className="bg-tertiary-400 rounded-lg"
            onPress={isRegister ? signUpWithEmail : signInWithEmail}
          >
            <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
              {isRegister ? 'Register' : 'Sign In'}
            </ButtonText>
          </Button>

          <Divider className="mt-6 mb-3" />

          <View>
            <Text size="sm" style={{ fontFamily: 'Roboto-Regular' }}>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <Button
              variant="outline"
              size="md"
              className="mt-2 rounded-lg"
              onPress={() => {
                setIsRegister(!isRegister);
                setPasswordError('');
                setEmail('');
                setPassword('');
                setUsername('');
              }}
            >
              <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
                {isRegister ? 'Sign In' : 'Register'}
              </ButtonText>
            </Button>
          </View>

          <Button variant="outline" size="md" className="rounded-lg" onPress={signInWithGoogle}>
            <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>Sign In With Google</ButtonText>
          </Button>

        </View>
      </View>
    </View>
  );
}
