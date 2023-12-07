import { Button, Text, View } from 'react-native';

import { useSession } from '../../../contexts/authContext';

export default function Account() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title='Sign Out'
        onPress={signOut}>
      </Button>
    </View>
  );
}