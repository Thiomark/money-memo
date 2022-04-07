import { View, Dimensions, ActivityIndicator } from 'react-native'
import tw from 'tailwind-react-native-classnames';
const { width, height } = Dimensions.get('screen');

const Container = ({children, sides, loading = false, topPadding = 4}) => {
    return (
        <View style={[tw`bg-black flex w-full h-full ${sides && 'px-1'}`, {paddingTop: topPadding}]}>
            {loading ? (
                <View style={[tw`flex items-center justify-center`, {width, height}]}>
                    <ActivityIndicator size="large" color="gray" />
                </View>
            ) : (
                children
            )}
        </View>
    )
}

export default Container