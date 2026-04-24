import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/common/AppText';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';
import Typography from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';

type Mode = 'signin' | 'signup';
type ContactType = 'email' | 'phone';

function validate(
  mode: Mode,
  name: string,
  contact: string,
  password: string,
  contactType: ContactType,
): string | null {
  if (mode === 'signup' && name.trim().length < 2)
    return 'Please enter your full name (at least 2 characters).';

  if (contactType === 'email') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()))
      return 'Please enter a valid email address.';
  } else {
    const digits = contact.replace(/\D/g, '');
    if (digits.length < 10)
      return 'Please enter a valid 10-digit phone number.';
  }

  if (password.length < 6)
    return 'Password must be at least 6 characters.';

  return null;
}

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode]               = useState<Mode>('signin');
  const [contactType, setContactType] = useState<ContactType>('email');
  const [name, setName]               = useState('');
  const [contact, setContact]         = useState('');
  const [password, setPassword]       = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  function switchMode(m: Mode) {
    setMode(m);
    setError('');
    setName('');
    setContact('');
    setPassword('');
  }

  function switchContactType(t: ContactType) {
    setContactType(t);
    setContact('');
    setError('');
  }

  async function handleSubmit() {
    const err = validate(mode, name, contact, password, contactType);
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    const result = mode === 'signin'
      ? await signIn(contact, password)
      : await signUp(name, contact, password);

    setLoading(false);
    if (!result.ok) setError(result.error ?? 'Something went wrong.');
  }

  const isSignUp = mode === 'signup';

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* ─── Branding area ─── */}
          <View style={styles.brandArea}>
            <View style={styles.logoCircle}>
              <Ionicons name="fast-food" size={38} color={Colors.primary} />
            </View>
            <AppText style={styles.brandName}>FoodOrder</AppText>
            <AppText style={styles.brandTagline}>Great food, delivered fast</AppText>
          </View>

          {/* ─── Form card ─── */}
          <View style={styles.card}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cardScroll}
            >
              {/* Greeting */}
              <AppText style={styles.cardHeading}>
                {isSignUp ? 'Create account' : 'Welcome back 👋'}
              </AppText>
              <AppText style={styles.cardSub}>
                {isSignUp
                  ? 'Sign up to start ordering'
                  : 'Sign in to continue ordering'}
              </AppText>

              {/* Mode toggle */}
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[styles.modeBtn, !isSignUp && styles.modeBtnActive]}
                  onPress={() => switchMode('signin')}
                  activeOpacity={0.8}
                >
                  <AppText style={[styles.modeBtnText, !isSignUp && styles.modeBtnTextActive]}>
                    Sign In
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeBtn, isSignUp && styles.modeBtnActive]}
                  onPress={() => switchMode('signup')}
                  activeOpacity={0.8}
                >
                  <AppText style={[styles.modeBtnText, isSignUp && styles.modeBtnTextActive]}>
                    Sign Up
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Name field (Sign Up only) */}
              {isSignUp && (
                <View style={styles.fieldGroup}>
                  <AppText style={styles.fieldLabel}>Full Name</AppText>
                  <View style={styles.inputRow}>
                    <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                    <TextInput
                      value={name}
                      onChangeText={(t) => { setName(t); setError(''); }}
                      placeholder="John Smith"
                      placeholderTextColor={Colors.textMuted}
                      style={styles.input}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  </View>
                </View>
              )}

              {/* Email / Phone toggle */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <AppText style={styles.fieldLabel}>Contact</AppText>
                  <View style={styles.contactToggle}>
                    <TouchableOpacity
                      onPress={() => switchContactType('email')}
                      style={[styles.contactBtn, contactType === 'email' && styles.contactBtnActive]}
                      activeOpacity={0.75}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={13}
                        color={contactType === 'email' ? Colors.primary : Colors.textMuted}
                      />
                      <AppText style={[
                        styles.contactBtnText,
                        contactType === 'email' && styles.contactBtnTextActive,
                      ]}>
                        Email
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => switchContactType('phone')}
                      style={[styles.contactBtn, contactType === 'phone' && styles.contactBtnActive]}
                      activeOpacity={0.75}
                    >
                      <Ionicons
                        name="phone-portrait-outline"
                        size={13}
                        color={contactType === 'phone' ? Colors.primary : Colors.textMuted}
                      />
                      <AppText style={[
                        styles.contactBtnText,
                        contactType === 'phone' && styles.contactBtnTextActive,
                      ]}>
                        Phone
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputRow}>
                  {contactType === 'email' ? (
                    <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  ) : (
                    <View style={styles.phonePrefix}>
                      <AppText style={styles.phonePrefixText}>+1</AppText>
                    </View>
                  )}
                  <TextInput
                    value={contact}
                    onChangeText={(t) => { setContact(t); setError(''); }}
                    placeholder={contactType === 'email' ? 'you@example.com' : '(555) 000-0000'}
                    placeholderTextColor={Colors.textMuted}
                    style={styles.input}
                    keyboardType={contactType === 'email' ? 'email-address' : 'phone-pad'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password field */}
              <View style={styles.fieldGroup}>
                <AppText style={styles.fieldLabel}>Password</AppText>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={(t) => { setPassword(t); setError(''); }}
                    placeholder="Min 6 characters"
                    placeholderTextColor={Colors.textMuted}
                    style={[styles.input, { flex: 1 }]}
                    secureTextEntry={!showPwd}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity onPress={() => setShowPwd((v) => !v)} hitSlop={8}>
                    <Ionicons
                      name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot password (Sign In only) */}
              {!isSignUp && (
                <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
                  <AppText style={styles.forgotText}>Forgot password?</AppText>
                </TouchableOpacity>
              )}

              {/* Error message */}
              {!!error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={15} color={Colors.error} />
                  <AppText style={styles.errorText}>{error}</AppText>
                </View>
              )}

              {/* Submit button */}
              <TouchableOpacity
                style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.textInverse} size="small" />
                ) : (
                  <>
                    <AppText style={styles.submitText}>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </AppText>
                    <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
                  </>
                )}
              </TouchableOpacity>

              {/* Terms note for sign up */}
              {isSignUp && (
                <AppText style={styles.termsText}>
                  By creating an account you agree to our{' '}
                  <AppText style={styles.termsLink}>Terms of Service</AppText>
                  {' '}and{' '}
                  <AppText style={styles.termsLink}>Privacy Policy</AppText>.
                </AppText>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },

  // ─── Branding ───
  brandArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textInverse,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: Typography.size.md,
    color: 'rgba(255,255,255,0.80)',
    marginTop: 6,
  },

  // ─── White form card ───
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 12,
  },
  cardScroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  cardHeading: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  // ─── Sign In / Sign Up toggle ───
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Spacing.borderRadius.full,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.full,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  modeBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
  },
  modeBtnTextActive: {
    color: Colors.text,
    fontWeight: Typography.weight.bold,
  },

  // ─── Form fields ───
  fieldGroup: { marginBottom: Spacing.md },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  fieldLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 52,
  },

  inputIcon: { marginRight: 10 },

  input: {
    flex: 1,
    fontSize: Typography.size.md,
    color: Colors.text,
  },

  phonePrefix: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    marginRight: 10,
  },
  phonePrefixText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },

  // ─── Email / Phone toggle ───
  contactToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Spacing.borderRadius.full,
    padding: 3,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.full,
  },
  contactBtnActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  contactBtnText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
  },
  contactBtnTextActive: { color: Colors.primary },

  // ─── Forgot password ───
  forgotRow: { alignItems: 'flex-end', marginTop: -4, marginBottom: Spacing.md },
  forgotText: {
    fontSize: Typography.size.sm,
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },

  // ─── Error ───
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: `${Colors.error}12`,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.error}30`,
  },
  errorText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.error,
    lineHeight: 18,
  },

  // ─── Submit button ───
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Spacing.borderRadius.full,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40,
    shadowRadius: 14,
    elevation: 8,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  submitText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },

  // ─── Terms ───
  termsText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
});
