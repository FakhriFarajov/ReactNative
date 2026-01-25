import OrderCard from "@/components/screen/orders/order-card";
import Gradient from "@/components/ui/gradient";
import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCoffeeStore } from "@/store/use-product";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Orders() {
    const layoutTheme = useTheme();
    const styles = getStyles(layoutTheme.colorScheme);
    const { products, getProductTotalPrice, clearProducts } = useCoffeeStore()
    return (
        <View style={styles.container}>
            <Gradient />
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Orders</Text>
                    <Text style={styles.ordersFooterText}>Total: ${getProductTotalPrice()}</Text>
                    <TouchableOpacity onPress={clearProducts}>
                        <Text style={styles.ordersFooterText}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.orderList}>
                    {
                        products.map((product) => (
                            <OrderCard key={product.id} product={product} />
                        ))
                    }
                </View>
            </ScrollView>
            <View style={styles.ordersFooter}>


            </View>
        </View>
    );
}

const getStyles = (colorScheme: string) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: layoutTheme.fonts.sora.bold,
        color: colorScheme === "dark" ? layoutTheme.colors.neutral.white : layoutTheme.colors.neutral.black,
    },
    orderList: {
        flex: 1,
        gap: 8,
    },
    ordersFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: colorScheme === "dark" ? layoutTheme.colors.primary[900] : layoutTheme.colors.secondary[100],
        borderRadius: 5,
    },
    ordersFooterText: {},


})