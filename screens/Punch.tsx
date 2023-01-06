import React, {useEffect, useState} from "react";
import {
    Text,
    HStack,
    VStack,
    Box, FormControl, Input, Stack, Button, Checkbox,
} from "native-base";
import Constants from 'expo-constants';
import NativeBaseIcon from "../components/NativeBaseIcon";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {save_user, selectUser} from "../store";


export default function Login() {
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const updateUserState = (checked: boolean) => {
        if (checked)
            dispatch(save_user({username, password}))
        else
            dispatch(save_user({username: "", password: ""}))
    }

    useEffect(() => {
        console.log(user)
        if (user.username) {
            setUserName(user.username)
            setPassword(user.password)
        }
    }, [])
    return (
        <Box
            w="100%"
            _dark={{bg: "blueGray.900"}}
            _light={{bg: "blueGray.50"}}
            flex={1}
            pt={Constants.statusBarHeight + 15}
        >
            <VStack space={5} alignItems="center">
                <NativeBaseIcon/>
                <Box alignItems="center" w="100%">
                    <Box w="100%" maxWidth="300px">
                        <Stack mx="4" space={2}>
                            <FormControl isRequired>
                                <FormControl.Label>שם משתמש</FormControl.Label>
                                <Input value={username} onChangeText={e => setUserName(e)}></Input>
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>סיסמה</FormControl.Label>
                                <Input type={"password"} value={password}
                                       onChangeText={e => setPassword(e)}></Input>
                            </FormControl>
                            <FormControl>
                                <Button>
                                    התחברות
                                </Button>
                            </FormControl>
                            <Checkbox value={"זכור אותי"} isChecked={rememberMe}
                                      onChange={(e) => {
                                          updateUserState(e)
                                          setRememberMe(e)
                                      }}/>
                        </Stack>
                    </Box>
                </Box>
                <HStack space={2} alignItems="center">
                    <Text>שכחתי סיסמה</Text>
                </HStack>
            </VStack>
        </Box>

    );
}

