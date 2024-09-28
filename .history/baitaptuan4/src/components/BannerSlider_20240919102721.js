const BannerSlider = ({ data }) => {
  if (!data) {
    return <Text>No data available</Text>; // Kiểm tra nếu không có dữ liệu
  }

  return (
    <View>
      <Image
        source={{ uri: data.imageUrl }}
        style={{ width: 300, height: 150 }}
      />
      <ImageBackground
        source={{ uri: "https://example.com/your-image.jpg" }}
        style={{ width: 35, height: 35 }}
        imageStyle={{ borderRadius: 25 }}
      />
      <Text>{data.title}</Text>
    </View>
  );
};
