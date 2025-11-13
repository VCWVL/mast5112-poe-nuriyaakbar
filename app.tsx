import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ScrollView, Switch, Platform, ImageBackground, KeyboardAvoidingView, StyleProp, ViewStyle, useWindowDimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Svg, { Path, SvgProps } from 'react-native-svg';

//  TYPE DEFINITIONS 
type Page = 'splash' | 'auth' | 'userMenu' | 'chefMenu' | 'addMenuItem' | 'profile' | 'search' | 'orders' | 'bookmarks' | 'cart' | 'checkout';
type AuthMode = 'login' | 'signup';
type UserRole = 'user' | 'chef';
type ModalType = 'add' | 'edit' | 'delete' | 'itemDetail' | null;
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  category: 'Starters' | 'Mains' | 'Desserts';
}

interface CartItem extends MenuItem {
    quantity: number;
}

//  MOCK DATA 
const initialMenuData: MenuItem[] = [
  {
    id: 1,
    name: 'CRISPY CHICKEN NACHOS',
    description: 'Crispy tortilla chips piled high with seasoned shredded chicken, melted cheddar, fresh salsa, jalapeños, and a swirl of sour cream.',
    price: '$22',
    rating: 4,
    image: 'https://fedandfit.com/wp-content/uploads/2022/02/240306_sheet-pan-nachos-10.jpg',
    category: 'Starters',
  },
  {
    id: 2,
    name: 'GRILLED CHEESE & TOMATO SOUP',
    description: 'A buttery, melted cheese sandwich paired with warm, tangy tomato soup.',
    price: '$20',
    rating: 5,
    image: 'https://simply-delicious-food.com/wp-content/uploads/2019/08/Tomato-soup-with-grilled-cheese-5.jpg',
    category: 'Starters',
  },
  {
      id: 3,
      name: 'AVO ON TOAST',
      description: 'Creamy avocado spread on toasted bread, simple and fresh.',
      price: '$18',
      rating: 4,
      image: 'https://www.eatingbirdfood.com/wp-content/uploads/2023/12/avocado-toast-hero-cropped.jpg',
      category: 'Starters',
  },
  {
    id: 4,
    name: 'PASTA ALFREDO',
    description: 'Creamy fettuccine alfredo with grilled chicken and parmesan.',
    price: '$25',
    rating: 5,
    image: 'https://midwestfoodieblog.com/wp-content/uploads/2023/07/chicken-alfredo-1.jpg',
    category: 'Mains',
  },
  {
      id: 5,
      name: 'CHOCOLATE LAVA CAKE',
      description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.',
      price: '$12',
      rating: 5,
      image: 'https://www.billyparisi.com/wp-content/uploads/2022/02/lava-cake-1.jpg',
      category: 'Desserts',
  }
];


//  SVG ICON PROPS 
interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}


//  SVG ICONS 
const HomeIcon = ({ size = 24, color = '#000', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
    <Path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const SearchIcon = ({ size = 24, color = '#000', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
    <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const ListIcon = ({ size = 24, color = '#fff', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
    <Path d="M4 6h16M4 12h16M4 18h7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const BookmarkIcon = ({ size = 24, color = '#000', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
    <Path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props} />
  </Svg>
);
const UserIcon = ({ size = 24, color = '#000', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
    <Path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const EditIcon = ({ size = 24, color = '#374151', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
    <Path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const DeleteIcon = ({ size = 24, color = '#374151', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
    <Path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Additional Inline Icons (converted to components) 
    const ArrowRightIcon = ({ size = 24, color = '#fff', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </Svg>
);
const GoogleIcon = ({ style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
    <Svg style={style} viewBox="0 0 48 48" {...props}>
        <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></Path>
        <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></Path>
        <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></Path>
        <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></Path>
        <Path fill="none" d="M0 0h48v48H0z"></Path>
    </Svg>
);

const TwitterIcon = ({ style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
    <Svg style={style} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <Path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.633 4.21 3.793 4.649-.55.149-1.13.21-1.729.21-.299 0-.58-.027-.85-.079.618 1.953 2.423 3.377 4.564 3.417-1.796 1.407-4.066 2.245-6.516 2.245-.42 0-.834-.025-1.24-.073 2.298 1.474 5.021 2.34 8.001 2.34 9.673 0 14.966-7.933 14.588-14.868.995-.717 1.853-1.612 2.534-2.625z"></Path>
    </Svg>
);

const CartIcon = ({ style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
    <Svg width={24} height={24} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </Svg>
);

const ChevronLeftIcon = ({ size = 24, color = '#000', style, ...props }: IconProps & { style?: StyleProp<ViewStyle> }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} style={style} {...props}>
        <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </Svg>
);


// MODAL COMPONENT 
const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => (
    <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.modalCloseButton}>&times;</Text>
                </TouchableOpacity>
            </View>
            {children}
        </View>
    </View>
);


//  UI COMPONENTS 

const SplashScreen: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onNavigate();
        }, 2000); // Navigate after 2 seconds
        return () => clearTimeout(timer);
    }, [onNavigate]);

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop' }} 
            style={styles.splashContainer}
            imageStyle={styles.splashFooterImage} // Applies style to the image itself
        >
            <View style={styles.splashHeader}>
                <TouchableOpacity onPress={onNavigate}>
                    <ArrowRightIcon style={{ height: 32, width: 32 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.splashBody}>
                 <Text style={[styles.splashTitle, styles.textShadow]}>WELCOME TO</Text>
                <Text style={[styles.splashTitle, styles.textShadow, { marginBottom: 32 }]}>CHRISTOFFELS KITCHEN !!!</Text>
                <Text style={styles.splashSubtitle}>Your very own</Text>
                <Text style={styles.splashSubtitle}>private</Text>
                <Text style={styles.splashSubtitle}>chef &lt;3</Text>
            </View>
        </ImageBackground>
    );
};

const AuthScreen: React.FC<{ onLogin: (role: UserRole, email: string, name: string) => void }> = ({ onLogin }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [role, setRole] = useState<UserRole>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleAuthAction = () => {
        if (mode === 'login') {
            if (email.toLowerCase().includes('chef')) {
                onLogin('chef', email, 'Christoffel'); // Chef login gets the default name
            } else {
                onLogin('user', email, email.split('@')[0]); // Fallback for user login
            }
        } else {
            if (password !== confirmPassword) {
                Alert.alert("Sign Up Error", "Passwords do not match.");
                return;
            }
            onLogin(role, email, fullName);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=2069&auto=format&fit=crop' }} style={styles.authScreenContainer} imageStyle={styles.authFooterImage}>
                <View style={styles.authHeaderCurve}>
                     <Text style={[styles.authHeaderTitle, styles.textShadow]}>CHRISTOFFELS KITCHEN</Text>
                </View>
                <View style={styles.authFormContainer}>
                    <View style={styles.authToggleContainer}>
                        <TouchableOpacity
                            onPress={() => setMode('login')}
                            style={[styles.authToggleButton, mode === 'login' && styles.authToggleButtonActive]}
                        >
                            <Text style={[styles.authToggleButtonText, mode === 'login' && styles.authToggleButtonTextActive]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setMode('signup')}
                            style={[styles.authToggleButton, mode === 'signup' && styles.authToggleButtonActive]}
                        >
                            <Text style={[styles.authToggleButtonText, mode === 'signup' && styles.authToggleButtonTextActive]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: 24, gap: 16 }}>
                        {mode === 'signup' && (
                            <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} style={styles.authInput}/>
                        )}
                        <TextInput placeholder="Enter email or username" value={email} onChangeText={setEmail} style={styles.authInput}/>
                        <View>
                            <TextInput secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} style={styles.authInput}/>
                            {/* Eye icon functionality would need state */}
                        </View>
                        {mode === 'signup' && (
                            <TextInput secureTextEntry placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} style={styles.authInput}/>
                        )}
                    </View>

                    {mode === 'login' && (
                        <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
                            <Text style={styles.authForgotPassword}>Forgot Password?</Text>
                        </View>
                    )}
                    
                    {mode === 'signup' && (
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 8 }}>Sign up as:</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setRole('user')}>
                                    <Switch value={role === 'user'} onValueChange={() => setRole('user')} trackColor={{ false: "#767577", true: "#f87171" }} thumbColor={"#f4f3f4"} />
                                    <Text style={{ marginLeft: 8, fontSize: 14 }}>User</Text>
                                </TouchableOpacity>
                                 <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setRole('chef')}>
                                    <Switch value={role === 'chef'} onValueChange={() => setRole('chef')} trackColor={{ false: "#767577", true: "#f87171" }} thumbColor={"#f4f3f4"} />
                                    <Text style={{ marginLeft: 8, fontSize: 14 }}>Chef</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleAuthAction}
                        style={styles.authSubmitButton}
                    >
                        <Text style={styles.authSubmitButtonText}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.authOrText}>OR</Text>

                    <View style={styles.authSocialContainer}>
                        <TouchableOpacity style={[styles.authSocialButton, { backgroundColor: '#3B5998' }]}><Text style={styles.authSubmitButtonText}>f</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.authSocialButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB' }]}>
                            <GoogleIcon style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.authSocialButton, { backgroundColor: '#1DA1F2' }]} >
                            <TwitterIcon style={{ width: 24, height: 24, color: '#fff' }}/>
                        </TouchableOpacity>
                    </View>

                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};


// existing code
const UserMenuScreen: React.FC<{ 
    menuItems: MenuItem[],
    onNavigate: (page: Page) => void,
    onSelectItem: (item: MenuItem) => void,
    cartItemCount: number,
    onLogout: () => void;
    onToggleSidebar: () => void;    
    onToggleBookmark: (itemId: number) => void;
    bookmarkedItemIds: number[];
}> = ({ menuItems, onNavigate, onSelectItem, cartItemCount, onLogout, onToggleSidebar, onToggleBookmark, bookmarkedItemIds }) => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);

    const ITEM_WIDTH = 192; // from styles.menuItemCard
    const ITEM_GAP = 16; // from styles.menuItemsScroll
    const SCROLL_AMOUNT = ITEM_WIDTH + ITEM_GAP;
    const { width } = useWindowDimensions();
    const [activeCategory, setActiveCategory] = useState<'Starters' | 'Mains' | 'Desserts' | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    const [hoveredCategoryName, setHoveredCategoryName] = useState<string | null>(null);
    const [isParentScrollEnabled, setIsParentScrollEnabled] = useState(true);

    const displayedItems = menuItems
        .filter(item => item.category === (activeCategory || 'Starters'))
        .filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleScroll = (direction: 'forward' | 'backward') => {
        const newPosition = direction === 'forward' 
            ? Math.min(scrollPosition + SCROLL_AMOUNT, contentWidth - scrollViewWidth)
            : Math.max(0, scrollPosition - SCROLL_AMOUNT);
        
        scrollViewRef.current?.scrollTo({ x: newPosition, animated: true });
    };

    const canScrollForward = scrollPosition < contentWidth - scrollViewWidth - 1;

    const CategoryButton: React.FC<{ name: string, icon: string, isActive: boolean, onClick: () => void }> = ({ name, icon, isActive, onClick }) => {
        const isHovered = Platform.OS === 'web' && hoveredCategoryName === name;
        const showActiveStyle = isActive || isHovered;

        return (
            <TouchableOpacity 
                onPress={onClick} 
                style={[styles.categoryButton, showActiveStyle && styles.categoryButtonActive]}
                onMouseEnter={() => setHoveredCategoryName(name)}
                onMouseLeave={() => setHoveredCategoryName(null)}
            >
                <View style={[styles.categoryButtonIconContainer, !isActive && { backgroundColor: '#F3F4F6' }]}>
                    <Image source={{uri: icon}} style={[styles.categoryButtonIcon]}/>
                </View>
                <Text style={[styles.categoryButtonText, isActive && styles.categoryButtonTextActive]}>{name}</Text>
            </TouchableOpacity>
        );
    };

    const MenuItemCard: React.FC<{ item: MenuItem, isFeatured: boolean, isBookmarked: boolean, onToggleBookmark: (id: number) => void }> = ({ item, isFeatured, isBookmarked, onToggleBookmark }) => (
        <View
             onMouseEnter={() => setHoveredItemId(item.id)}
             onMouseLeave={() => setHoveredItemId(null)}
         >
            <TouchableOpacity onPress={() => onSelectItem(item)} style={[styles.menuItemCard, isFeatured ? styles.menuItemCardFeatured : styles.menuItemCardRegular]}>
                <TouchableOpacity 
                    onPress={(e) => {
                        e.stopPropagation(); // Prevent card press when toggling bookmark
                        onToggleBookmark(item.id);
                    }} 
                    style={styles.bookmarkButton}
                >
                    <BookmarkIcon 
                        fill={isBookmarked ? '#FBBF24' : 'none'} 
                        color={isBookmarked ? '#FBBF24' : '#9CA3AF'} />
                </TouchableOpacity>
                <Image source={{uri: item.image}} style={[styles.menuItemImage, isFeatured && { transform: [{ scale: 1.1 }] }]} />
                <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <View style={styles.menuItemRatingContainer} key={item.id}>
                        {Array(5).fill(0).map((_, i) => (
                            <Text key={i} style={{ color: i < item.rating ? '#FBBF24' : '#D1D5DB' }}>★</Text>
                        ))}
                    </View>
                    <Text style={[styles.menuItemPrice, isFeatured ? { color: '#fff' } : { color: '#000' }]}>{item.price}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.userMenuContainer} contentContainerStyle={{ paddingBottom: 96 }} scrollEnabled={isParentScrollEnabled}>
            <View style={styles.userMenuHeader}>
                <TouchableOpacity onPress={onToggleSidebar}>
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path d="M4 6h16M4 12h16M4 18h16" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>CK</Text>
                <TouchableOpacity onPress={onLogout} style={styles.userMenuProfileButton}>
                    <Text style={styles.userMenuProfileButtonText}>LOG OUT</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 24 }}>
                <Text style={styles.userMenuTitle}>Choose the</Text>
                <Text style={[styles.userMenuTitle, { color: '#374151' }]}>food you love</Text>
                <View style={styles.searchContainer}>
                    <TextInput 
                        placeholder="Search for a food item" 
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <SearchIcon color="#9CA3AF" style={styles.searchIcon}/>
                </View>
            </View>

            <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <Text style={{ color: '#6B7280', fontSize: 14 }}>{menuItems.length} items</Text>
                </View>
                <View style={styles.categoriesContainer}>
                    <CategoryButton name="Starters" icon="https://cdn-icons-png.flaticon.com/512/3480/3480823.png" isActive={activeCategory === 'Starters'} onClick={() => setActiveCategory('Starters')} />
                    <CategoryButton name="Mains" icon="https://cdn-icons-png.flaticon.com/512/1046/1046798.png" isActive={activeCategory === 'Mains'} onClick={() => setActiveCategory('Mains')} />
                    <CategoryButton name="Desserts" icon="https://cdn-icons-png.flaticon.com/512/2917/2917621.png" isActive={activeCategory === 'Desserts'} onClick={() => setActiveCategory('Desserts')} />
                </View>
            </View>
            
            <View 
                onTouchStart={() => setIsParentScrollEnabled(false)}
                onMomentumScrollEnd={() => setIsParentScrollEnabled(true)}
            >
                 <Text style={[styles.sectionTitle, { textTransform: 'uppercase' }]}>{(activeCategory || 'Starters')}:</Text>
                 <ScrollView 
                    ref={scrollViewRef}
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.menuItemsScroll} 
                    nestedScrollEnabled={true}
                    onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
                    onContentSizeChange={(width) => setContentWidth(width)}
                    onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
                    scrollEventThrottle={16}
                 >
                     {displayedItems.length > 0 ? 
                        displayedItems.map((item, index) => (
                            <MenuItemCard 
                                key={item.id} 
                                item={item} 
                                isFeatured={hoveredItemId === item.id} 
                                isBookmarked={bookmarkedItemIds.includes(item.id)}
                                onToggleBookmark={onToggleBookmark}
                            />
                        )) :
                        <View style={{ width: '100%', alignItems: 'center', paddingVertical: 40 }}><Text style={{ color: '#6B7280' }}>No items match your search.</Text></View>
                    }
                 </ScrollView>
                {displayedItems.length > 1 && (
                   <View style={styles.scrollArrowsContainer}>
                       <TouchableOpacity onPress={() => handleScroll('backward')} disabled={scrollPosition === 0} style={[styles.scrollArrow, scrollPosition === 0 && styles.scrollArrowDisabled]}>
                           <ChevronLeftIcon color="#fff" />
                       </TouchableOpacity>
                       <TouchableOpacity onPress={() => handleScroll('forward')} disabled={!canScrollForward} style={[styles.scrollArrow, !canScrollForward && styles.scrollArrowDisabled]}>
                           <ChevronLeftIcon color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
                       </TouchableOpacity>
                   </View>
                )}
 
            </View>

            {/* Only show bottom nav on mobile or small web screens */}
            {!(Platform.OS === 'web' && width > 768) && (
                <View style={styles.bottomNavContainer}>
                    <View style={{ position: 'relative' }}>
                        <View style={styles.bottomNav}>
                            {/* Left Icons */}
                            <View style={styles.bottomNavSection}>
                                <TouchableOpacity onPress={() => onNavigate('userMenu')}><HomeIcon color="#f87171"/></TouchableOpacity>
                                <TouchableOpacity onPress={() => onNavigate('search')}><SearchIcon color="#9CA3AF"/></TouchableOpacity>
                            </View>
                            {/* Right Icons */}
                            <View style={styles.bottomNavSection}>
                                <TouchableOpacity onPress={() => onNavigate('bookmarks')}><BookmarkIcon color="#9CA3AF"/></TouchableOpacity>
                                <TouchableOpacity onPress={() => onNavigate('profile')}><UserIcon color="#9CA3AF"/></TouchableOpacity>
                            </View>
                        </View>
                        {/* Centered Cart Button */}
                        <TouchableOpacity onPress={() => onNavigate('cart')} style={styles.cartButton}>
                            <CartIcon style={{ height: 32, width: 32, color: '#fff' }} />
                            {cartItemCount > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const ChefMenuScreen: React.FC<{
    menuItems: MenuItem[];
    onAddItem: (item: Omit<MenuItem, 'id' | 'rating'>) => void;
    onEditItem: (item: MenuItem) => void;
    onDeleteItem: (itemId: number) => void;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}> = ({ menuItems, onAddItem, onEditItem, onDeleteItem, onNavigate, onLogout }) => {
    const [modal, setModal] = useState<ModalType>(null);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [activeCategory, setActiveCategory] = useState<'Starters' | 'Mains' | 'Desserts' | 'all'>('all');
    
    const openModal = (type: ModalType, item: MenuItem | null = null) => {
        setModal(type);
        setSelectedItem(item);
    };
    
    const closeModal = () => {
        setModal(null);
        setSelectedItem(null);
    };

    const handleSave = (itemToSave: MenuItem) => {
        if (modal === 'add') {
            // The onAddItem function expects an object without id and rating.
            // We destructure them out before passing the item.
            const { id, rating, ...newItemData } = itemToSave;
            onAddItem(newItemData);
        } else if (modal === 'edit' && selectedItem) {
            onEditItem(itemToSave);
        }
        closeModal();
    };

    const handleDeleteConfirm = () => {
        if (selectedItem) {
            onDeleteItem(selectedItem.id);
        }
        closeModal();
    };

    const categories = ['Starters', 'Mains', 'Desserts'];

    const calculateAveragePrice = (category: 'Starters' | 'Mains' | 'Desserts') => {
        const itemsInCategory = menuItems.filter(item => item.category === category);
        if (itemsInCategory.length === 0) {
            return '$0.00';
        }
        const total = itemsInCategory.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (isNaN(price) ? 0 : price);
        }, 0);
        const average = total / itemsInCategory.length;
        return `$${average.toFixed(2)}`;
    };

    const averagePrices = { Starters: calculateAveragePrice('Starters'), Mains: calculateAveragePrice('Mains'), Desserts: calculateAveragePrice('Desserts') };

    
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <ScrollView style={styles.chefMenuContainer} contentContainerStyle={{ paddingBottom: 96 }}>
            <View style={styles.chefMenuHeader}>
                <Text style={styles.chefMenuTitle}>Your Menu</Text>
                <TouchableOpacity onPress={onLogout} style={styles.userMenuProfileButton}>
                    <Text style={styles.userMenuProfileButtonText}>LOG OUT</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 24, marginTop: 8 }}>
                <Text style={{ color: '#6B7280', marginTop: 4 }}>Manage your menu items below.</Text>
            </View>

            <View style={styles.averagePriceContainer}>
                <Text style={styles.sectionTitle}>Average Prices</Text>
                <View style={styles.averagePriceBoxContainer}>
                    <View style={styles.averagePriceBox}>
                        <Text style={styles.averagePriceLabel}>Starters</Text><Text style={styles.averagePriceValue}>{averagePrices.Starters}</Text>
                    </View>
                    <View style={styles.averagePriceBox}>
                        <Text style={styles.averagePriceLabel}>Mains</Text><Text style={styles.averagePriceValue}>{averagePrices.Mains}</Text>
                    </View>
                    <View style={styles.averagePriceBox}>
                        <Text style={styles.averagePriceLabel}>Desserts</Text><Text style={styles.averagePriceValue}>{averagePrices.Desserts}</Text>
                    </View>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chefCategoryScroll}>
                {(['all', 'Starters', 'Mains', 'Desserts'] as const).map(cat => (
                    <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)} style={[styles.chefCategoryButton, activeCategory === cat && styles.chefCategoryButtonActive]}>
                        <Text style={[styles.chefCategoryButtonText, activeCategory === cat && styles.chefCategoryButtonTextActive]}>{cat.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View>
                {categories.filter(cat => activeCategory === 'all' || activeCategory === cat).map(category => (
                    <View key={category} style={{ marginBottom: 32 }}>
                        <Text style={styles.chefMenuCategoryTitle}>{category.toUpperCase()}:</Text>
                        <View style={{ gap: 16 }}>
                            {menuItems.filter(i => i.category === category).map(item => (
                                 <View key={item.id} style={styles.chefMenuItem}>
                                     <View style={styles.chefMenuItemContent}>
                                        <Image source={{uri: item.image}} style={styles.chefMenuItemImage}/>
                                        <View style={{ flex: 1 }}>
                                             <Text style={styles.chefMenuItemName}>{item.name}</Text>
                                             <Text style={styles.chefMenuItemDescription}>{item.description}</Text>
                                        </View>
                                        <View style={styles.chefMenuItemActions}>
                                            <TouchableOpacity onPress={() => openModal('edit', item)}><EditIcon size={20}/></TouchableOpacity>
                                            <TouchableOpacity onPress={() => openModal('delete', item)}><DeleteIcon size={20} color="#EF4444"/></TouchableOpacity>
                                        </View>
                                     </View>
                                 </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
            
            <View style={styles.chefMenuAddButtonContainer}>
                <TouchableOpacity onPress={() => onNavigate('addMenuItem')} style={styles.chefMenuAddButton}>
                    <ListIcon/>
                    <Text style={styles.authSubmitButtonText}>ADD MENU ITEMS</Text>
                </TouchableOpacity>
            </View>
            
            {modal && (
                modal === 'delete' ? (
                     <Modal onClose={closeModal} title="Confirm Deletion">
                        <Text>Are you sure you want to delete "{selectedItem?.name}"?</Text>
                        <View style={styles.modalActionContainer}>
                            <TouchableOpacity onPress={closeModal} style={[styles.modalButton, styles.modalCancelButton]}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity> 
                            <TouchableOpacity onPress={handleDeleteConfirm} style={[styles.modalButton, styles.modalDeleteButton]}>
                                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                ) : modal === 'add' || modal === 'edit' ? (
                    <AddEditItemModal item={selectedItem} onSave={handleSave} onClose={closeModal} mode={modal}/>
                ) : null
            )}
        </ScrollView>
        </View>
    );
};

const AddMenuItemScreen: React.FC<{
    onBack: () => void;
    onAddItem: (item: Omit<MenuItem, 'id' | 'rating'>) => void;
}> = ({ onBack, onAddItem }) => {
    const [formData, setFormData] = useState<Omit<MenuItem, 'id' | 'rating'>>({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'Starters',
    });

    const handleChange = (name: keyof typeof formData, value: string | 'Starters' | 'Mains' | 'Desserts') => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Basic validation
        if (!formData.name || !formData.price) {
            Alert.alert("Missing Information", "Please fill in at least the name and price.");
            return;
        }
        onAddItem(formData);
        onBack(); // Go back to the menu after adding
    };

    return (
        <View style={styles.cartContainer}>
            <View style={styles.cartHeader}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 16, padding: 8, marginLeft: -8 }}><ChevronLeftIcon /></TouchableOpacity>
                <Text style={styles.cartTitle}>Add New Menu Item</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 16 }}>
                <TextInput value={formData.name} onChangeText={(val) => handleChange('name', val)} placeholder="Name" style={styles.formInput} />
                <TextInput multiline value={formData.description} onChangeText={(val) => handleChange('description', val)} placeholder="Description" style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} />
                <TextInput value={formData.price} onChangeText={(val) => handleChange('price', val)} placeholder="Price (e.g., $25)" style={styles.formInput} />
                <TextInput value={formData.image} onChangeText={(val) => handleChange('image', val)} placeholder="Image URL" style={styles.formInput} />
                <View style={[styles.formInput, { padding: 0 }]}>
                    <Picker selectedValue={formData.category} onValueChange={(itemValue) => handleChange('category', itemValue)}><Picker.Item label="Starters" value="Starters" /><Picker.Item label="Mains" value="Mains" /><Picker.Item label="Desserts" value="Desserts" /></Picker>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={handleSubmit} style={[styles.authSubmitButton, { marginTop: 'auto' }]}><Text style={styles.authSubmitButtonText}>Save Item</Text></TouchableOpacity>
        </View>
    );
};

const AddEditItemModal: React.FC<{item: MenuItem | null, onSave: (item: MenuItem) => void, onClose: () => void, mode: 'add' | 'edit'}> = ({item, onSave, onClose, mode}) => {
    const [formData, setFormData] = useState<Omit<MenuItem, 'id' | 'rating'>>({
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || '',
        image: item?.image || '',
        category: item?.category || 'Starters',
    });
    
    const handleChange = (name: keyof typeof formData, value: string | 'Starters' | 'Mains' | 'Desserts') => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave({ ...formData, id: item?.id || 0, rating: item?.rating || 0 });
    };

    return (
         <Modal onClose={onClose} title={mode === 'add' ? "Add Menu Item" : "Edit Menu Item"}>
            <ScrollView style={{ maxHeight: 500 }}>
              <View style={{ gap: 16 }}>
                <TextInput value={formData.name} onChangeText={(val) => handleChange('name', val)} placeholder="Name" style={styles.formInput}/>
                <TextInput multiline value={formData.description} onChangeText={(val) => handleChange('description', val)} placeholder="Description" style={[styles.formInput, { height: 80 }]}/>
                <TextInput value={formData.price} onChangeText={(val) => handleChange('price', val)} placeholder="Price" style={styles.formInput}/>
                <TextInput value={formData.image} onChangeText={(val) => handleChange('image', val)} placeholder="Image URL" style={styles.formInput}/>
                <View style={[styles.formInput, { padding: 0 }]}>
                    <Picker
                        selectedValue={formData.category}
                        onValueChange={(itemValue) => handleChange('category', itemValue)}>
                        <Picker.Item label="Starters" value="Starters" />
                        <Picker.Item label="Mains" value="Mains" />
                        <Picker.Item label="Desserts" value="Desserts" />
                    </Picker>
                </View>
                 </View>
            </ScrollView>
                <View style={styles.modalActionContainer}>
                    <TouchableOpacity onPress={onClose} style={[styles.modalButton, styles.modalCancelButton]}>
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={[styles.modalButton, styles.modalSaveButton]}>
                        <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
                    </TouchableOpacity>
                </View>
        </Modal>
    );
};

//  NEW COMPONENTS for Item Detail and Cart 

const ItemDetailModal: React.FC<{
    item: MenuItem;
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
    onToggleBookmark: (itemId: number) => void;
    isBookmarked: boolean;
}> = ({ item, onClose, onAddToCart, onToggleBookmark, isBookmarked }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        onAddToCart({ ...item, quantity });
        onClose();
    };

    const calculateTotalPrice = () => {
        const priceValue = parseFloat(item.price.replace('$', ''));
        const total = priceValue * quantity;
        return `$${total.toFixed(2)}`;
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.itemDetailContainer}>
                <TouchableOpacity onPress={onClose} style={styles.itemDetailBackButton}>
                    <ChevronLeftIcon color="#374151" />
                </TouchableOpacity>
                 <View style={styles.itemDetailHandle} />
                <Image source={{uri: item.image}} style={styles.itemDetailImage}/>
                <View style={styles.itemDetailNameContainer}>
                    <Text style={styles.itemDetailName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => onToggleBookmark(item.id)}>
                        <BookmarkIcon 
                            fill={isBookmarked ? '#FBBF24' : 'none'} 
                            color={isBookmarked ? '#FBBF24' : '#9CA3AF'} 
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.itemDetailRatingContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        {Array(5).fill(0).map((_, i) => <Text key={`${item.id}-${i}`} style={{color: i < item.rating ? '#FBBF24' : '#D1D5DB'}}>★</Text>)}
                    </View>
                    <Text style={styles.itemDetailRatingText}>{item.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.itemDetailDescription}>{item.description}</Text>
                <View style={styles.itemDetailQuantityContainer}>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.quantityButton}><Text style={styles.quantityButtonText}>-</Text></TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>+</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.itemDetailPrice}>{calculateTotalPrice()}</Text>
                </View>
                <TouchableOpacity onPress={handleAddToCart} style={styles.authSubmitButton}>
                    <Text style={styles.authSubmitButtonText}>Add To Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const CartScreen: React.FC<{
    cartItems: CartItem[];
    onNavigate: (page: Page) => void;
    onRemoveItem: (itemId: number) => void;
}> = ({ cartItems, onNavigate, onRemoveItem }) => {

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <View style={styles.cartContainer}>
            <View style={styles.cartHeader}>
                <TouchableOpacity onPress={() => onNavigate('userMenu')} style={{ marginRight: 16, padding: 8, marginLeft: -8 }}>
                    <Svg height={24} width={24} fill="none" viewBox="0 0 24 24" stroke="currentColor"><Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></Svg>
                </TouchableOpacity>
                <Text style={styles.cartTitle}>My Cart</Text>
            </View>
            
            {cartItems.length === 0 ? (
                <View style={styles.cartEmptyContainer}>
                    <CartIcon style={{ height: 96, width: 96, marginBottom: 16 }} strokeWidth={1} color="#6B7280"/>
                    <Text style={{ fontSize: 18, color: '#6B7280' }}>Your cart is empty.</Text>
                    <TouchableOpacity onPress={() => onNavigate('userMenu')} style={styles.cartStartShoppingButton}>
                        <Text style={{ color: '#fff' }}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, marginHorizontal: -24 }}>
                    {cartItems.map(item => (
                        <View key={item.id} style={styles.cartItemContainer}>
                            <Image source={{uri: item.image}} style={styles.cartItemImage}/>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>x {item.quantity}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 4 }}>{item.price}</Text>
                            </View>
                            <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
                                <DeleteIcon/>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {cartItems.length > 0 && (
                <View style={styles.cartFooter}>
                    <View style={styles.cartTotalContainer}>
                        <Text style={styles.cartTotalText}>Total:</Text>
                        <Text style={styles.cartTotalText}>${calculateTotal()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onNavigate('checkout')} style={styles.authSubmitButton}>
                        <Text style={styles.authSubmitButtonText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const ProfileScreen: React.FC<{ 
    onBack: () => void; 
    onLogout: () => void;
    userRole: UserRole | null;
    userName: string;
    userEmail: string;
}> = ({ onBack, onLogout, userRole, userName, userEmail }) => {
    const profileOptions = [
        { name: 'Edit Profile', icon: <EditIcon size={20} color="#6B7280" /> },
        { name: 'Settings', icon: <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}><Path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><Path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></Svg> },
        { name: 'Notifications', icon: <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}><Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><Path d="M13.73 21a2 2 0 01-3.46 0" /></Svg> },
        { name: 'Help Center', icon: <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}><Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><Path d="M12 17.01h.01" /></Svg> },
    ];

    const isChef = userRole === 'chef';
    const profileName = isChef ? 'Christoffel' : userName;
    const profileEmail = isChef ? 'christoffel.kitchen@example.com' : userEmail;
    const profileImageUri = isChef 
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2080&auto=format&fit=crop'
        : `https://i.pravatar.cc/150?u=${userEmail}`; // Use a placeholder avatar service

    return (
        <ScrollView style={styles.profileContainer}>
            <View style={styles.cartHeader}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 16, padding: 8, marginLeft: -8 }}>
                    <ChevronLeftIcon />
                </TouchableOpacity>
                <Text style={styles.cartTitle}>My Profile</Text>
            </View>

            <View style={styles.profileInfoContainer}>
                <Image 
                    source={{ uri: profileImageUri }} 
                    style={styles.profileImage} 
                />
                <Text style={styles.profileName}>{profileName}</Text>
                <Text style={styles.profileEmail}>{profileEmail}</Text>
            </View>

            <View style={styles.profileOptionsContainer}>
                {profileOptions.map((option) => (
                    <TouchableOpacity key={option.name} style={styles.profileOptionItem}>
                        <View style={styles.profileOptionIcon}>{option.icon}</View>
                        <Text style={styles.profileOptionText}>{option.name}</Text>
                        <ChevronLeftIcon size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity onPress={onLogout} style={styles.profileLogoutButton}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2}><Path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></Svg>
                <Text style={styles.profileLogoutButtonText}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const MobileMenuDrawer: React.FC<{
    onClose: () => void;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}> = ({ onClose, onNavigate, onLogout }) => {
    const menuOptions = [
        { name: 'Home', icon: <HomeIcon color="#6B7280" />, page: 'userMenu' as Page },
        { name: 'Search', icon: <SearchIcon color="#6B7280" />, page: 'search' as Page },
        { name: 'Bookmarks', icon: <BookmarkIcon color="#6B7280" />, page: 'bookmarks' as Page },
        { name: 'My Profile', icon: <UserIcon color="#6B7280" />, page: 'profile' as Page },
    ];

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        onClose();
    };

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.mobileDrawerContainer}>
                <Text style={styles.sidebarLogo}>CK</Text>
                <View style={{ gap: 16, marginTop: 32 }}>
                    {menuOptions.map(option => (
                        <TouchableOpacity key={option.name} style={styles.mobileDrawerItem} onPress={() => handleNavigate(option.page)}>
                            {option.icon}
                            <Text style={styles.mobileDrawerText}>{option.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={[styles.mobileDrawerItem, { marginTop: 'auto' }]} onPress={handleLogout}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2}><Path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></Svg>
                    <Text style={[styles.mobileDrawerText, { color: '#EF4444' }]}>Log Out</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        </View>
    );
};

const SearchScreen: React.FC<{
    menuItems: MenuItem[];
    onBack: () => void;
    onSelectItem: (item: MenuItem) => void;
}> = ({ menuItems, onBack, onSelectItem }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = searchQuery.length > 1 
        ? menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <View style={styles.searchScreenContainer}>
            <View style={styles.cartHeader}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 16, padding: 8, marginLeft: -8 }}>
                    <ChevronLeftIcon />
                </TouchableOpacity>
                <Text style={styles.cartTitle}>Search</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput 
                    placeholder="Search for a food item..." 
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                />
                <SearchIcon color="#9CA3AF" style={styles.searchIcon}/>
            </View>

            <ScrollView>
                {filteredItems.map(item => ( 
                    <TouchableOpacity key={item.id} style={styles.cartItemContainer} onPress={() => onSelectItem(item)}>
                        <Image source={{uri: item.image}} style={styles.cartItemImage}/>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                            <Text style={{ fontSize: 14, color: '#6B7280' }} numberOfLines={2}>{item.description}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 4 }}>{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {searchQuery.length > 1 && filteredItems.length === 0 && (
                <View style={styles.cartEmptyContainer}>
                    <Text style={{ fontSize: 18, color: '#6B7280' }}>No results found for "{searchQuery}"</Text>
                </View>
            )}
        </View>
    );
};

const BookmarksScreen: React.FC<{
    bookmarkedItems: MenuItem[];
    onBack: () => void;
    onSelectItem: (item: MenuItem) => void;
}> = ({ bookmarkedItems, onBack, onSelectItem }) => {
    return (
        <View style={styles.cartContainer}>
            <View style={styles.cartHeader}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 16, padding: 8, marginLeft: -8 }}>
                    <ChevronLeftIcon />
                </TouchableOpacity>
                <Text style={styles.cartTitle}>My Bookmarks</Text>
            </View>

            {bookmarkedItems.length === 0 ? ( 
                <View style={styles.cartEmptyContainer}>
                    <BookmarkIcon size={96} color="#6B7280" strokeWidth={1} style={{ marginBottom: 16 }} />
                    <Text style={{ fontSize: 18, color: '#6B7280' }}>You have no bookmarked items.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    {bookmarkedItems.map(item => (
                        <TouchableOpacity key={item.id} style={styles.cartItemContainer} onPress={() => onSelectItem(item)}>
                            <Image source={{uri: item.image}} style={styles.cartItemImage}/>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                <Text style={{ fontSize: 14, color: '#6B7280' }} numberOfLines={2}>{item.description}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 4 }}>{item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const CheckoutScreen: React.FC<{
    onBack: () => void;
    onPlaceOrder: () => void;
    total: string;
}> = ({ onBack, onPlaceOrder, total }) => {
    return (
        <View style={styles.cartContainer}>
            <View style={styles.cartHeader}>
                <TouchableOpacity onPress={onBack} style={{ marginRight: 16, padding: 8, marginLeft: -8 }}>
                    <ChevronLeftIcon />
                </TouchableOpacity>
                <Text style={styles.cartTitle}>Checkout</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <Text style={styles.checkoutSectionTitle}>Shipping Information</Text>
                <View style={styles.checkoutForm}>
                    <TextInput placeholder="Full Name" style={styles.formInput} />
                    <TextInput placeholder="Address" style={styles.formInput} />
                    <TextInput placeholder="City" style={styles.formInput} />
                    <TextInput placeholder="Postal Code" style={styles.formInput} keyboardType="numeric" />
                </View>

                <Text style={styles.checkoutSectionTitle}>Payment Method</Text>
                <View style={styles.checkoutForm}>
                    <TextInput placeholder="Card Number" style={styles.formInput} keyboardType="numeric" />
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <TextInput placeholder="MM/YY" style={[styles.formInput, { flex: 1 }]} />
                        <TextInput placeholder="CVC" style={[styles.formInput, { flex: 1 }]} keyboardType="numeric" />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.cartFooter}>
                <View style={styles.cartTotalContainer}>
                    <Text style={styles.cartTotalText}>Total:</Text>
                    <Text style={styles.cartTotalText}>${total}</Text>
                </View>
                <TouchableOpacity onPress={onPlaceOrder} style={styles.authSubmitButton}>
                    <Text style={styles.authSubmitButtonText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


// PLACEHOLDER SCREENS 
// const PlaceholderScreen: React.FC<{ screenName: string, onBack: () => void }> = ({ screenName, onBack }) => (
//     <View style={styles.placeholderContainer}>
//         <Text style={styles.placeholderTitle}>{screenName}</Text>
//         <Text style={styles.placeholderText}>This is a placeholder for the {screenName.toLowerCase()} screen. The full functionality would be built out here.</Text>
//         <TouchableOpacity onPress={onBack} style={styles.placeholderButton}>
//             <Text style={styles.authSubmitButtonText}>Go Back to Menu</Text>
//         </TouchableOpacity>
//     </View>
// );

const WebLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    // This component wraps the app and provides a desktop-friendly layout
    // It's only for web, so we can use web-specific elements and styles.
    return Platform.OS === 'web' ? (
      <View style={styles.webLayout}>
        {children}
      </View>
    ) : (
      <>{children}</>
    )
}

//  MAIN APP COMPONENT 
export default function App() {
    const { width } = useWindowDimensions();
    const [page, setPage] = useState<Page>('splash');
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuData);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [bookmarkedItemIds, setBookmarkedItemIds] = useState<number[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Determine if we are on a large web screen
    const isWebDesktop = Platform.OS === 'web' && width > 768;

    const handleLogin = (role: UserRole, email: string, name: string) => {
        setUserRole(role);
        setUserName(name);
        setUserEmail(email);
        setPage(role === 'chef' ? 'chefMenu' : 'userMenu');
    };
    
    useEffect(() => {
        // Show sidebar by default on large screens, hide on small
        setIsSidebarVisible(isWebDesktop);
    }, [isWebDesktop]);

    const handleNavigate = (newPage: Page) => {
        setPage(newPage);
    };

    const handleSelectItem = (item: MenuItem) => {
        setSelectedItem(item);
    };

    const handleAddToCart = (itemToAdd: CartItem) => {
        setCartItems(prevCart => {
            const existingItem = prevCart.find(item => item.id === itemToAdd.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === itemToAdd.id 
                    ? { ...item, quantity: item.quantity + itemToAdd.quantity } 
                    : item
                );
            }
            return [...prevCart, itemToAdd];
        });
    };

    const handleToggleBookmark = (itemId: number) => {
        setBookmarkedItemIds(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            }
            return [...prev, itemId];
        });
    };
    const handleLogout = () => {
        setUserRole(null);
        setUserName('');
        setUserEmail('');
        setCartItems([]); // Clear cart on logout
        setPage('auth');
    };

    const handleAddItem = (itemToAdd: Omit<MenuItem, 'id' | 'rating'>) => {
        const newItem: MenuItem = { ...itemToAdd, id: Date.now(), rating: 0 }; // New items get a new ID and default 0 rating
        setMenuItems(prev => [...prev, newItem]);
    };

    const handleEditItem = (itemToEdit: MenuItem) => {
        setMenuItems(prev => prev.map(item => item.id === itemToEdit.id ? itemToEdit : item));
    };

    const handleDeleteItem = (itemId: number) => {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
    };


    const handleRemoveFromCart = (itemId: number) => {
        setCartItems(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const handlePlaceOrder = () => {
        Alert.alert(
            "Order Placed!",
            "Thank you for your purchase. Your private chef will be in touch shortly.",
            [{ text: "OK", onPress: () => {
                setCartItems([]);
                setPage('userMenu');
            }}]
        );
    };

    const handleToggleSidebar = () => {
        if (isWebDesktop) {
            setIsSidebarVisible(prev => !prev);
        } else {
            setIsMobileMenuOpen(prev => !prev);
        }
    };

    const renderPage = () => {
        switch (page) {
            case 'splash':
                return <SplashScreen onNavigate={() => setPage('auth')} />;
            case 'auth':
                return <AuthScreen onLogin={handleLogin} />;
            case 'userMenu':
                return <UserMenuScreen 
                            menuItems={menuItems} 
                            onNavigate={handleNavigate}
                            onSelectItem={handleSelectItem}
                            cartItemCount={cartItems.length}
                            onLogout={handleLogout}
                            onToggleSidebar={handleToggleSidebar}
                            onToggleBookmark={handleToggleBookmark}
                            bookmarkedItemIds={bookmarkedItemIds}
                        />;
            case 'chefMenu':
                return <ChefMenuScreen 
                            menuItems={menuItems}
                            onAddItem={handleAddItem}
                            onEditItem={handleEditItem}
                            onDeleteItem={handleDeleteItem}
                            onNavigate={handleNavigate}
                            onLogout={handleLogout}
                        />;
            case 'cart':
                return <CartScreen cartItems={cartItems} onNavigate={handleNavigate} onRemoveItem={handleRemoveFromCart}/>;
            case 'addMenuItem':
                return <AddMenuItemScreen 
                            onBack={() => handleNavigate('chefMenu')}
                            onAddItem={handleAddItem}
                        />;
            case 'profile':
                 return <ProfileScreen 
                            onBack={() => handleNavigate(userRole === 'chef' ? 'chefMenu' : 'userMenu')} 
                            onLogout={handleLogout}
                            userRole={userRole}
                            userName={userName}
                            userEmail={userEmail}
                        />;
            case 'search':
                 return <SearchScreen menuItems={menuItems} onBack={() => handleNavigate('userMenu')} onSelectItem={handleSelectItem} />;
            case 'bookmarks':
                 return <BookmarksScreen 
                            bookmarkedItems={menuItems.filter(item => bookmarkedItemIds.includes(item.id))} 
                            onBack={() => handleNavigate('userMenu')} 
                            onSelectItem={handleSelectItem} 
                        />;
            case 'checkout':
                 const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0).toFixed(2);
                 return <CheckoutScreen 
                            onBack={() => handleNavigate('cart')} 
                            onPlaceOrder={handlePlaceOrder}
                            total={total}
                        />;
            default:
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Page not found</Text></View>;
        }
    };

    return (
      <WebLayout>
        <View style={styles.appContainer}>
            {/* Sidebar for Desktop Web - visibility is now controlled by state */}
            {isSidebarVisible && userRole === 'user' && page !== 'splash' && page !== 'auth' && (
                <View style={styles.sidebarContainer}>
                    <Text style={styles.sidebarLogo}>CK</Text>
                    <View style={styles.sidebarNav}>
                        <TouchableOpacity onPress={() => handleNavigate('userMenu')} style={[styles.sidebarButton, page === 'userMenu' && styles.sidebarButtonActive]}><HomeIcon color={page === 'userMenu' ? '#fff' : '#6B7280'}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNavigate('search')} style={[styles.sidebarButton, page === 'search' && styles.sidebarButtonActive]}><SearchIcon color={page === 'search' ? '#fff' : '#6B7280'}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNavigate('bookmarks')} style={[styles.sidebarButton, page === 'bookmarks' && styles.sidebarButtonActive]}><BookmarkIcon color={page === 'bookmarks' ? '#fff' : '#6B7280'}/></TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNavigate('profile')} style={[styles.sidebarButton, page === 'profile' && styles.sidebarButtonActive]}><UserIcon color={page === 'profile' ? '#fff' : '#6B7280'}/></TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 'auto', position: 'relative' }}>
                        <TouchableOpacity onPress={() => handleNavigate('cart')} style={styles.sidebarCartButton}>
                            <CartIcon style={{ height: 24, width: 24, color: '#4B5563' }} />
                            {cartItems.length > 0 && <View style={styles.sidebarCartBadge}><Text style={styles.sidebarCartBadgeText}>{cartItems.length}</Text></View>}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <View style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                {renderPage()}
            </View>
            {isMobileMenuOpen && (
                <MobileMenuDrawer 
                    onClose={() => setIsMobileMenuOpen(false)}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                />
            )}
            {selectedItem && page !== 'chefMenu' && (
                <ItemDetailModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    onAddToCart={handleAddToCart}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarkedItemIds.includes(selectedItem.id)}
                />)}
        </View>
      </WebLayout>
    );
}

const styles = StyleSheet.create({
  // Generic
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '91.666667%',
    maxWidth: 384,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    color: '#f87171',
    fontSize: 30,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 24,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalButtonText: {
    fontWeight: '600',
  },
  modalCancelButton: {
    backgroundColor: '#E5E7EB',
  },
  modalDeleteButton: {
    backgroundColor: '#EF4444',
  },
  modalSaveButton: {
    backgroundColor: '#22C55E',
  },
  // Mobile Menu Drawer
  mobileDrawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '75%',
    maxWidth: 300,
    backgroundColor: '#fff',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  mobileDrawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  mobileDrawerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  // Form
  formInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  // SplashScreen
  splashContainer: {
    flex: 1,
    backgroundColor: '#f87171',
    justifyContent: 'space-between',
    padding: 32,
    borderRadius: 24,
    position: 'relative',
  },
  splashHeader: {
    alignSelf: 'flex-end',
  },
  splashBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -64,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
  },
  splashFooterImage: {
    resizeMode: 'cover',
    // The ImageBackground component will position this correctly.
    // We can adjust the image position within the background if needed.
    // For example, to keep it at the bottom:
    top: undefined,
    bottom: 0,
  },
  // AuthScreen
  authScreenContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    position: 'relative',
    justifyContent: 'space-between',
  },
  authHeaderCurve: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 288,
    backgroundColor: '#f87171',
    borderBottomLeftRadius: 144,
    borderBottomRightRadius: 144,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  authHeaderTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  authFormContainer: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    width: '91.666667%',
    maxWidth: 384,
    zIndex: 10,
    marginTop: 128,
  },
  authToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 9999,
    padding: 4,
    marginBottom: 24,
  },
  authToggleButton: {
    width: '50%',
    paddingVertical: 8,
    borderRadius: 9999,
  },
  authToggleButtonActive: {
    backgroundColor: '#ef4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  authToggleButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  authToggleButtonTextActive: {
    color: '#fff',
  },
  authInput: {
    width: '100%',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    fontSize: 14,
  },
  authForgotPassword: {
    fontSize: 12,
    color: '#6B7280',
  },
  authSubmitButton: {
    width: '100%',
    backgroundColor: '#f87171', // Simplified gradient
    paddingVertical: 12,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  authSubmitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  authOrText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginVertical: 16,
    fontSize: 14,
  },
  authSocialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  authSocialButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  authFooterImage: {
    resizeMode: 'contain',
    justifyContent: 'flex-end',
  },
  // UserMenuScreen
  userMenuContainer: {
    flex: 1,
    padding: 24,
  },
  userMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userMenuProfileButton: {
    backgroundColor: '#f87171',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  userMenuProfileButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userMenuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative',
    marginTop: 16,
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderWidth: 0,
    borderRadius: 9999,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }], // Adjust based on icon size
    height: 20,
    width: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    // marginBottom: 12, // Removed as it's now on the parent View
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuItemsScroll: {
    gap: 16,
    paddingHorizontal: 24,
    marginHorizontal: -24,
    paddingBottom: 16,
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  paginationDot: {
    width: 6,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
  },
  scrollArrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginTop: -40, // Position over the scroll view
    marginBottom: 24, // Space before next element
    gap: 8,
  },
  scrollArrow: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
    borderRadius: 9999,
  },
  scrollArrowDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  // CategoryButton
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Make it flexible
    minWidth: 80, // Minimum width to prevent squishing
    maxWidth: 120, // Maximum width
    aspectRatio: 0.85, // Maintain aspect ratio
    borderRadius: 16,
    backgroundColor: '#fff',
    marginHorizontal: 8, // Add horizontal margin for spacing
    paddingVertical: 12, // Adjust padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    transform: [{ scale: 1.05 }],
    borderWidth: 2,
    borderColor: '#f87171',
  },
  categoryButtonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryButtonIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryButtonTextActive: {
    color: '#f87171',
  },
  // MenuItemCard
  menuItemCard: {
    flexShrink: 0,
    width: 192,
    height: 256,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  menuItemCardRegular: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItemCardFeatured: {
    backgroundColor: '#f87171',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    transform: [{ scale: 1.05 }], // Added scale transform
  },
  menuItemImage: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    width: 112,
    height: 112,
    borderRadius: 56,
    resizeMode: 'cover',
  },
  menuItemContent: {
    marginTop: 'auto',
    paddingTop: 96,
    alignItems: 'center',
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuItemRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  // BottomNav
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
  },
  bottomNav: {
    backgroundColor: '#fff',
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
  },
  bottomNavSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
  },
  cartButton: {
    position: 'absolute',
    top: -24,
    left: '50%',
    transform: [{ translateX: -32 }],
    width: 64,
    height: 64,
    backgroundColor: '#ef4444',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  cartBadgeText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Average Price
  averagePriceContainer: {
    marginBottom: 24,
  },
  averagePriceBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  averagePriceBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  averagePriceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  averagePriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // ChefMenuScreen
  chefMenuContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  chefMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  chefMenuTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  chefCategoryScroll: {
    gap: 12,
    marginBottom: 24,
  },
  chefCategoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chefCategoryButtonActive: {
    backgroundColor: '#f87171',
    borderColor: '#f87171',
  },
  chefCategoryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 12,
  },
  chefCategoryButtonTextActive: {
    color: '#fff',
  },
  chefMenuCategoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  chefMenuItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  chefMenuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  chefMenuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  chefMenuItemName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  chefMenuItemDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  chefMenuItemActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  chefMenuAddButtonContainer: {
    position: 'relative',
    padding: 16,
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  chefMenuAddButton: {
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  itemDetailBackButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 9999,
  },
  // ItemDetailModal
  itemDetailContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 448,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    position: 'absolute',
    bottom: 0,
  },
  itemDetailHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  itemDetailImage: {
    width: '100%',
    height: 192,
    resizeMode: 'cover',
    borderRadius: 16,
    marginBottom: 16,
  },
  itemDetailNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDetailRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  itemDetailRatingText: {
    color: '#6B7280',
    marginLeft: 8,
    fontSize: 14,
  },
  itemDetailDescription: {
    color: '#4B5563',
    marginBottom: 24,
    fontSize: 14,
  },
  itemDetailQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemDetailPrice: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  // CartScreen
  cartContainer: {
    flex: 1,
    padding: 24,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartStartShoppingButton: {
    marginTop: 16,
    backgroundColor: '#f87171',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 16,
  },
  cartFooter: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cartTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTotalText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  // ProfileScreen
  profileContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  profileOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  profileLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    padding: 16,
    gap: 8,
  },
  profileLogoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // SearchScreen
  searchScreenContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  // CheckoutScreen
  checkoutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  checkoutForm: {
    gap: 16,
    marginBottom: 16,
  },
  // WebLayout & App
  webLayout: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  appContainer: {
    width: '100%',
    maxWidth: 1280,
    height: Platform.OS === 'web' ? '90vh' : '100%',
    maxHeight: 900,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
    borderRadius: 24,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 96,
    backgroundColor: 'rgba(249, 250, 251, 0.75)',
    paddingVertical: 32,
    alignItems: 'center',
    gap: 32,
    borderRightWidth: 1,
    borderRightColor: 'rgba(229, 231, 235, 0.5)',
  },
  sidebarLogo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f87171',
  },
  sidebarNav: {
    alignItems: 'center',
    gap: 24,
  },
  sidebarButton: {
    padding: 12,
    borderRadius: 8,
  },
  sidebarButtonActive: {
    backgroundColor: '#f87171',
  },
  sidebarCartButton: {
    padding: 12,
    borderRadius: 9999,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarCartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
