import { useRouter } from 'expo-router';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import {
  FormControl,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { GoogleIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField /*, InputIcon, InputSlot*/ } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

export default function SignIn() {
  const router = useRouter();

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
          <Text size="2xl" style={{ fontFamily: 'Roboto-Bold' }}>Sign In</Text>
        </View>

        <FormControl className="gap-1">
          <FormControlLabelText>Email</FormControlLabelText>
          <Input>
            <InputField
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </Input>
        </FormControl>

        <FormControl className="gap-1">
          <FormControlLabelText>Password</FormControlLabelText>
          <Input>
            <InputField placeholder="Password" secureTextEntry />
            {/* Optional visibility toggle:
            <InputSlot onPress={() => setShow((s) => !s)}>
              <InputIcon as={show ? EyeIcon : EyeOffIcon} />
            </InputSlot>
            */}
          </Input>
          <FormControlHelperText>Must be atleast 6 characters.</FormControlHelperText>
        </FormControl>

        <Button
          variant="solid"
          size="md"
          action="primary"
          className="bg-tertiary-400 rounded-lg"
          onPress={() => router.push('/getting-started')}
        >
          <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>Sign In</ButtonText>
        </Button>


        <Button variant="outline" size="md" className="rounded-lg">
          <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>Sign In With Google</ButtonText>
        </Button>
        <Divider className="mt-6 mb-3" />

        <View>
          <Text size="sm" style={{ fontFamily: 'Roboto-Regular' }}>Don't have an account?</Text>
          <Button variant="outline" size="md" className="my-2 rounded-lg">
            <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>Register</ButtonText>
          </Button>
        </View>
      </View>
      </View>
    </View>
  );
}
