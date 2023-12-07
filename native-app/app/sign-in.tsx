import { router } from 'expo-router';
import { View } from '../components/Themed';
import { useSession } from '../contexts/authContext';
import { TextInput, StyleSheet, Button } from 'react-native';
import { useState } from 'react';


export default function SignIn() {
  const { signIn, signUp, session } = useSession();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const onPressLogin = async () => {
    const signedIn = await signIn(username, password);
    if (signedIn) {
      // TODO: Remove setTimeout - terrible solution
      setTimeout(() => {
        router.replace('/')
      }, 75)
      
    }
  };

  const onPressSignUp = async () => {
    const signedIn = await signUp(username, password);
    if (signedIn) {
      // TODO: Remove setTimeout - terrible solution
      setTimeout(() => {
        router.replace('/')
      }, 75)
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>


      <View style={styles.loginBtn}>
        <Button
          title='Login'
          onPress={onPressLogin}>
        </Button>
      </View>

      <View style={styles.loginBtn}>
        <Button
          title='Sign Up'
          onPress={onPressSignUp}>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#BABABA",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  loginBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
