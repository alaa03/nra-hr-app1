import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import CircularProgress from "react-native-circular-progress-indicator";
import {resetWork, selectShifts, selectWorkStart, setStartWork} from "../store/slices/workSlice";
import {useDispatch, useSelector} from "react-redux";
import {differenceInSeconds, format, intervalToDuration} from "date-fns";
import {Box, Center, FlatList, Text, VStack} from "native-base";
import Constants from "expo-constants";
import FlipCard, {RotateAxis} from "react-native-flip"

const LOCATION_TRACKING = 'location-tracking';

let padTwo = (num: number) => num <= 99 ? `0${num}`.slice(-2) : num;

export default function Background() {
    const [t, setT] = useState(0)
    const dispatch = useDispatch()
    const startWork = useSelector(selectWorkStart);
    const [side, setSide] = useState(0)
    const shifts = useSelector(selectShifts);
    const timeStr = useMemo(() => {
        if (startWork) {
            const duration = intervalToDuration({start: startWork, end: new Date()});
            return `${padTwo(duration.hours || 0)}:${padTwo(duration.minutes || 0)}:${padTwo(duration.seconds || 0)}`;
        }
        return ""
    }, [t])
    const startLocationTracking = async () => {
        await Location.requestForegroundPermissionsAsync();
        let {status} = await Location.requestBackgroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }
    };

    useEffect(() => {
        startLocationTracking().then().catch()
        const interval = setInterval(() => {

            setT(cur => cur + 1)
        }, 1000)
        return () => {
            clearInterval((interval))
        }
    }, []);

    const startInterval = () => {
        if (startWork) {
            dispatch(resetWork())
            setT(0)
        } else {
            dispatch(setStartWork())
            setT(0)
        }
    }
    return (
        <Box
            w="100%"
            _dark={{bg: "blueGray.900"}}
            _light={{bg: "blueGray.50"}}
            flex={1}
            pt={Constants.statusBarHeight + 15}
        >
            <VStack space={5} alignItems="center">
                <TouchableOpacity onPress={startInterval}>
                    <CircularProgress
                        inActiveStrokeOpacity={startWork ? 0 : 0}
                        activeStrokeWidth={19}
                        inActiveStrokeWidth={14}
                        value={startWork ? 0 : 0}
                        radius={120}
                        showProgressValue={false}
                        progressValueColor={startWork ? '#39c264' : '#39c264'}
                        circleBackgroundColor={startWork ? "rgba(255,49,49,0.68)" : '#39c264'}
                        maxValue={60 * 60}
                        title={startWork ? "סיים" : "התחל"}
                        titleColor={'#fff'}
                        titleStyle={{fontWeight: 'bold'}}
                    />
                </TouchableOpacity>
                {timeStr && <Text fontSize="4xl">{timeStr}</Text>}
                <FlatList style={{width: "100%", direction: 'rtl'}} p={10} data={shifts}
                          renderItem={(item) => {
                              return <Box width="100%" alignItems={"flex-end"} style={{flexDirection: 'column'}}>
                                  <Text size={'2xl'} style={{direction: 'rtl'}}>
                                      {`${item.index}. ${format(new Date(item.item.start), "HH:ii:ss")} - ${format(new Date(item.item.end), "HH:ii:ss")}`}
                                  </Text>
                              </Box>
                          }
                          }/>

            </VStack>
            {/*<VStack space={3} alignItems={"flex-end"} p={10}>*/}
            {/*    {startWork && <Text size={"2xl"}>שעת התחלה - {format(new Date(startWork), "hh:ii:ss")}</Text>}*/}
            {/*</VStack>*/}
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({data, error}) => {
    if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error);
        return;
    }
    if (data) {
        //@ts-ignore
        const {locations} = data;
        let lat = locations[0].coords.latitude;
        let long = locations[0].coords.longitude;

        console.log(
            `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
        );
    }
});
