import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Picker from '../../../components/Picker';
import { MachineType } from '../../../data/types';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { useSession } from '../../../contexts/authContext';

const TablePage = () => {
  const { session } = useSession();
  const [machineName, setMachineName] = useState('');
  const [machineData, setMachineData] = useState('');
  const machineNames = [
    { label: 'Welding Robot', value: MachineType.WeldingRobot },
    { label: 'PaintingStation', value: MachineType.PaintingStation },
    { label: 'Assembly Line', value: MachineType.AssemblyLine },
    { label: 'Quality Control Station', value: MachineType.QualityControlStation },
  ];

  const getScores = async (machineName) => {
    console.log('get', `${BASE_URL}/scores/${machineName}`);
    console.log('machine', machineName);
    
    try {
      const response = await axios.get(`${BASE_URL}/machine-health/scores/${machineName}`,
        {
          headers: {
            Authorization: 'Bearer ' + session
          }
        });

      console.log(response);
      

      if (response.data) {
        setMachineData(response.data);
      }
    } catch (e) {
      if (e.response) {
        console.error(e.response.data.message);
      }
      else {
        console.error(e);
      }
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.score}</Text>
      <Text style={styles.cell}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text>Machine Name</Text>
        <Picker
          value={machineName}
          onSetValue={getScores}
          items={machineNames}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerCell}>Score</Text>
        <Text style={styles.headerCell}>Date</Text>
      </View>
      <FlatList
        data={machineData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
  },
});

export default TablePage;