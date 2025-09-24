import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';

export type CodeInputMode = 'otp' | 'passcode';

type CodeInputProps = {
  length?: number;
  mode?: CodeInputMode; // otp shows digits, passcode shows dots
  value?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
};

/**
 * Reliable code input for RN 0.76 / Expo SDK 54.
 * Uses a single hidden TextInput to avoid focus handoffs across multiple inputs
 * (which are flaky on some Android keyboards like Gboard).
 */
export default function CodeInput({
  length = 6,
  mode = 'otp',
  value,
  onChange,
  onComplete,
  autoFocus,
  containerStyle,
  boxStyle,
}: CodeInputProps) {
  const [code, setCode] = useState<string>(value ?? '');
  const inputRef = useRef<TextInput | null>(null);

  // keep internal state in sync with external value
  useEffect(() => {
    if (typeof value === 'string' && value !== code) {
      setCode(value.slice(0, length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length]);

  const handleChangeText = useCallback(
    (t: string) => {
      const sanitized = (t.match(/\d+/g) || []).join('').slice(0, length);
      setCode(sanitized);
      onChange?.(sanitized);
      if (sanitized.length === length) {
        onComplete?.(sanitized);
      }
    },
    [length, onChange, onComplete]
  );

  const handlePressAnywhere = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const chars = useMemo(() => {
    const arr: string[] = new Array(length).fill('');
    for (let i = 0; i < code.length && i < length; i++) arr[i] = code[i];
    return arr;
  }, [code, length]);

  const focusedIndex = Math.min(code.length, length - 1);

  return (
    <Pressable style={[styles.container, containerStyle]} onPress={handlePressAnywhere}>
      {/* Hidden input captures all keyboard input reliably */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType={mode === 'otp' ? 'oneTimeCode' : 'password'}
        secureTextEntry={mode === 'passcode'}
        caretHidden
        value={code}
        onChangeText={handleChangeText}
        // Backspace support when empty
        onKeyPress={(e) => {
          if (e.nativeEvent.key === 'Backspace' && code.length > 0) {
            const next = code.slice(0, -1);
            setCode(next);
            onChange?.(next);
          }
        }}
        accessible={false}
      />

      {/* Visual boxes */}
      {chars.map((c, i) => {
        const isFocused = i === focusedIndex && code.length < length;
        return (
          <Pressable key={i} onPress={handlePressAnywhere} style={[styles.box, isFocused && styles.boxFocused, boxStyle]}>
            <Text style={styles.charText}>{mode === 'passcode' && c ? '•' : c}</Text>
          </Pressable>
        );
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0.01,
    width: 1,
    height: 1,
  },
  box: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6EB',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  boxFocused: {
    borderColor: '#A276FF',
  },
  charText: {
    fontSize: 20,
    color: '#1B1C39',
    textAlign: 'center',
  },
});

