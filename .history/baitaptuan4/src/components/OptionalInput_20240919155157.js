export default const OptionalInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
  }) => (
    <View className="mb-5">
      <Text className="font-semibold">{label}</Text>
      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );