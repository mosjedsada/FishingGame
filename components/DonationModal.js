import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Clipboard,
  ScrollView,
} from 'react-native';

const DonationModal = ({ visible, onClose }) => {
  const cryptoAddress = '0xffcba0b4980eb2d2336bfdb1e5a0fc49c620908a';

  const copyToClipboard = () => {
    Clipboard.setString(cryptoAddress);
    Alert.alert(
      'Copied! / คัดลอกแล้ว!',
      'Crypto address copied to clipboard / ที่อยู่คริปโตถูกคัดลอกแล้ว',
      [{ text: 'OK / ตกลง' }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Support the Game / รองรับเกม</Text>
          
          <ScrollView style={styles.scrollContent}>
            <View style={styles.donationSection}>
              <Text style={styles.sectionTitle}>💝 Donations / การบริจาค</Text>
              <Text style={styles.descriptionText}>
                If you enjoy this fishing game, consider supporting its development with a donation!
                / หากคุณสนุกกับเกมตกปลานี้ ลองพิจารณารองรับการพัฒนาเกมด้วยการบริจาค!
              </Text>
              
              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>Crypto Address / ที่อยู่คริปโต:</Text>
                <View style={styles.addressBox}>
                  <Text style={styles.addressText}>{cryptoAddress}</Text>
                </View>
                
                <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                  <Text style={styles.copyButtonText}>📋 Copy Address / คัดลอกที่อยู่</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>ℹ️ Information / ข้อมูล:</Text>
                <Text style={styles.infoText}>
                  • This address accepts various cryptocurrencies / ที่อยู่นี้รับคริปโตเคอร์เรนซี่หลายประเภท
                </Text>
                <Text style={styles.infoText}>
                  • Donations help improve the game / การบริจาคช่วยปรับปรุงเกม
                </Text>
                <Text style={styles.infoText}>
                  • Thank you for your support! / ขอบคุณสำหรับการสนับสนุน!
                </Text>
              </View>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close / ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E7D32',
  },
  scrollContent: {
    maxHeight: 400,
  },
  donationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1976D2',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#424242',
  },
  addressContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#424242',
  },
  addressBox: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 15,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#1976D2',
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976D2',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: '#424242',
  },
  closeButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DonationModal;
