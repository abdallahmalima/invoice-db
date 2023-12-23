'use client'
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    header: {
      fontSize: 20,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    listItem: {
      marginBottom: 10,
    },
    summary: {
      marginTop: 20,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  const clientData = [
    { name: 'Client 1', phone: '123-456-7890', fee: 100, checkInDate: '2023-01-01' },
    { name: 'Client 2', phone: '987-654-3210', fee: 150, checkInDate: '2023-02-15' },
    // Add more clients as needed
  ];
  
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Hotel Report</Text>
          {clientData.map((client, index) => (
            <View key={index} style={styles.listItem}>
              <Text>Name: {client.name}</Text>
              <Text>Phone: {client.phone}</Text>
              <Text>Fee: ${client.fee}</Text>
              <Text>Check-in Date: {client.checkInDate}</Text>
            </View>
          ))}
          <Text style={styles.summary}>
            Total Fees: ${clientData.reduce((sum, client) => sum + client.fee, 0)}
          </Text>
          <Text style={styles.summary}>
            Total Clients: {clientData.length}
          </Text>
        </View>
      </Page>
    </Document>
  );

export default MyDocument;