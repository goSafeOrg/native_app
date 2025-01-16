import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For search and filter icons
import { purple600 } from '@/utils/constants/colors';  // Assuming you already have this color constant

export default function SearchBar({ onSearch, onFilter }:{onSearch:(text:string)=>void, onFilter:()=>void}) {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <Icon name="search-outline" size={24} color={purple600} style={styles.icon} />

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor="#A9A9A9" // Light gray placeholder text color
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          onSearch(text);  // Optional callback to handle search input changes
        }}
      />

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={onFilter}>
        <Icon name="filter-outline" size={18} color="white" />
        <Text style={styles.filterText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling for the search bar
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderColor: 'white',
    borderWidth: 1,
    height:60,
    width: '100%', // Adjust to your desired width
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: purple600,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filterText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
});
