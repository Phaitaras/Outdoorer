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
      <View
        className="absolute left-1/2 -translate-x-1/2 top-16 z-10"
        pointerEvents="none"
      >
        <Image
          source={require('../../assets/images/full_icon.png')}
          className="w-[320px] h-[320px]"
          resizeMode="contain"
        />
      </View>

      <View className="flex-[0.4]" />

      <View className="flex-1 gap-3 bg-white rounded-t-[30px] p-10 shadow-lg">
        <View className="mt-[4.5rem]">
          <Text size="2xl" className="font-roboto-bold">Sign In</Text>
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
          <ButtonText className="font-roboto-medium">Sign In</ButtonText>
        </Button>


        <Button variant="outline" size="md" className="rounded-lg">
          <ButtonText className="font-roboto-medium">Sign In With Google</ButtonText>
        </Button>
        <Divider className="mt-6 mb-3" />

        <View className="">
          <Text className="">Don't have an account?</Text>
          <Button variant="outline" size="md" className="my-2 rounded-lg">
            <ButtonText className="font-roboto-medium">Register</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
