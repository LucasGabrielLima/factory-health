import { router } from 'expo-router';
import { Text, View } from '../components/Themed';
import { useSession } from '../contexts/authContext';

export default function SignIn() {
    const { signIn } = useSession();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          onPress={() => {
            signIn();
            // Navigate after signing in. You may want to tweak this to ensure sign-in is
            // successful before navigating.
            console.log('press')
            router.replace('/');
          }}>
          Sign In
        </Text>
      </View>
    );
  }