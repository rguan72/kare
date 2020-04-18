import React, { memo, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { Modal, Icon, Card, Text, withStyles, Button, Input } from "@ui-kitten/components";
import firebase from 'firebase';

function LoginScreen ({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [visible, setVisible] = useState(false);

  const onIconPress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (style) => (
    <TouchableWithoutFeedback onPress={onIconPress}>
      <Icon {...style} name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}/>
    </TouchableWithoutFeedback>
  );

  const _onLoginPressed = () => {
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function(error) {
      var errorCode = error.code;
      email.error = error.message;
      setVisible(true);
      navigation.navigate('Login');
    });

    navigation.navigate('Home');
  };

  return (
    <View style={{ marginTop: 30, backgroundColor: "#F3EAFF", flex: 1 }}>
      {/*<BackButton goBack={() => navigation.navigate('Home')} /> */}

      {/* <Logo /> */}

      <Text category='h1'>Welcome to Kare</Text>

      <View style={styles.container}>
        <Input
          placeholder='Please enter your email'
          returnKeyType="next"
          value={email.value}
          onChangeText={text => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.container}>
        <Input
          returnKeyType="done"
          value={password.value}
          placeholder='Please enter your password'
          accessoryRight={renderIcon}
          onChangeText={text => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry={secureTextEntry}
        />
      </View>

      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}

      <Button mode="contained" onPress={_onLoginPressed} style={{borderColor: "#5505BA", backgroundColor: "#5505BA"}}>
        Login
      </Button>

      <Modal visible={visible}>
        <Card disabled={true}>
          <Text> {email.error} </Text>
          <Button onPress={() => setVisible(false)}>
            CLOSE
          </Button>
        </Card>
      </Modal>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /*forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },*/
  container: {
    width: '100%',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: 'black',
  },
  link: {
    fontWeight: 'bold',
    color: 'mediumpurple',
  },
});

export default withStyles(LoginScreen, theme => ({
  light: {
    backgroundColor: theme["color-primary-100"]
  }
}));