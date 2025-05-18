import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface AddContactSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, contact: string) => void;
}

const AddContactSheet: React.FC<AddContactSheetProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [nameError, setNameError] = useState('');
  const [contactError, setContactError] = useState('');

  // Reset form when modal is closed
  const handleClose = () => {
    setName('');
    setContact('');
    setNameError('');
    setContactError('');
    onClose();
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!contact.trim()) {
      setContactError('Email or phone is required');
      isValid = false;
    } else {
      setContactError('');
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(name, contact);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.backButton}>
                <ArrowLeft size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add a new contact</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={[styles.input, nameError ? styles.inputError : null]}
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  placeholderTextColor={COLORS.placeholder}
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>

              {/* Contact Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email or phone</Text>
                <TextInput
                  style={[styles.input, contactError ? styles.inputError : null]}
                  value={contact}
                  onChangeText={setContact}
                  placeholder="+12481827412429"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="email-address"
                />
                {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={['#A276FF', '#8336E6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>ADD CONTACT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  form: {
    padding: SIZES.padding,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.card,
    color: COLORS.text,
    ...FONTS.body3,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...FONTS.body5,
    color: COLORS.error,
    marginTop: 5,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 20,
  },
  submitButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    ...FONTS.h3,
    color: COLORS.textWhite,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default AddContactSheet;
