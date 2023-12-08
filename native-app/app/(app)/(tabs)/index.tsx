import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { Link } from 'expo-router';
import axios from 'axios';
import { useMachineDataContext } from '../../../contexts/machineDataContext';
import { useCallback, useEffect } from 'react';
import { PartsOfMachine } from '../../../components/PartsOfMachine';
import { MachineScore } from '../../../components/MachineScore';
import { useSession } from '../../../contexts/authContext';
import { BASE_URL } from '../../../config';

export default function StateScreen() {
  const { session } = useSession();
  const { machineData, resetMachineData, loadMachineData, setScores } = useMachineDataContext();

  useEffect(() => {
    loadMachineData();
  }, [loadMachineData]);

  const calculateHealth = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_URL}/machine-health`, {
        machines: machineData?.machines,
      },
        {
          headers: {
            Authorization: 'Bearer ' + session
          }
        });

      if (response.data?.factory) {
        setScores(response.data);
      }
    } catch (e) {
      if (e.response) {
        console.error(e.response.data.message);
      }
      else {
        console.error(e);
      }
    }
  }, [machineData]);

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      {!machineData && (
        <Link href='/two' style={styles.link}>
          <Text style={styles.linkText}>
            Please log a part to check machine health
          </Text>
        </Link>
      )}
      {machineData && (
        <>
          <PartsOfMachine
            machineName={'Welding Robot'}
            parts={machineData?.machines?.weldingRobot}
          />
          <PartsOfMachine
            machineName={'Assembly Line'}
            parts={machineData?.machines?.assemblyLine}
          />
          <PartsOfMachine
            machineName={'Painting Station'}
            parts={machineData?.machines?.paintingStation}
          />
          <PartsOfMachine
            machineName={'Quality Control Station'}
            parts={machineData?.machines?.qualityControlStation}
          />
          <View
            style={styles.separator}
            lightColor='#eee'
            darkColor='rgba(255,255,255,0.1)'
          />
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {machineData?.scores?.factory
              ? machineData?.scores?.factory
              : 'Not yet calculated'}
          </Text>
          {machineData?.scores?.machineScores && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {Object.keys(machineData?.scores?.machineScores).map((key) => (
                <MachineScore
                  key={key}
                  machineName={key}
                  score={machineData?.scores?.machineScores[key]}
                />
              ))}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <Button title='Calculate Health' onPress={calculateHealth} />
      <View style={styles.resetButton}>
        <Button
          title='Reset Machine Data'
          onPress={async () => await resetMachineData()}
          color='#FF0000'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  resetButton: {
    marginTop: 10,
  },
});