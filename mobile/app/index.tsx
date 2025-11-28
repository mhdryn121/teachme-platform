import { Text, View, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                padding: 20,
            }}
        >
            <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: "#2563eb", marginBottom: 10 }}>
                    Teach Me Something
                </Text>
                <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center" }}>
                    Master any skill with AI-powered learning.
                </Text>
            </View>

            <Link href="/(tabs)/home" asChild>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#2563eb",
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        borderRadius: 9999,
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                        Get Started
                    </Text>
                </TouchableOpacity>
            </Link>

            <View style={{ marginTop: 40 }}>
                <Text style={{ color: "#9ca3af", fontSize: 14 }}>
                    Built with Expo & React Native
                </Text>
            </View>
        </View>
    );
}
