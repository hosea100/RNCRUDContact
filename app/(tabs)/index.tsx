import React, { useEffect, useState, useMemo } from 'react';
import { 
  Image, 
  StyleSheet,
  View, 
  ActivityIndicator, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  RefreshControl,
  Button
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { RootStackParamList } from '@/types/types';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [contactData, setContactData] = useState<RootStackParamList['ContactDetail'][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<RootStackParamList['ErrorType'] | null>(null);

  const fetchData = () => {
    axiosInstance.getRequest('https://contact.herokuapp.com/contact', {
      headers: {}
    }).then(data => {
      setContactData(data?.data);
      setLoading(false);
      setRefreshing(false);
    }).catch(err => {
      setError(err);
      setLoading(false);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const sections = useMemo(() => {
    if (!Array.isArray(contactData)) {
      return [];
    }

    const sectionsMap = contactData.reduce((acc, item) => {
      const firstNameLetter = item.firstName[0].toUpperCase();
      return {
        ...acc,
        [firstNameLetter]: [...(acc[firstNameLetter] || []), item],
      };
    }, {} as Record<string, RootStackParamList['ContactDetail'][]>);

    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items,
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [contactData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error?.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Contacts</Text>
          <Button
            title="Add Contact"
            onPress={() => navigation.navigate('contact-detail', { mode: 'add' })}
          />
        </View>
        {sections.map(({ letter, items }) => (
          <View style={styles.section} key={letter}>
            <Text style={styles.sectionTitle}>{letter}</Text>
            <View style={styles.sectionItems}>
              {items.map(({ photo, firstName, lastName, age, id }) => (
                <View key={id} style={styles.cardWrapper}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('contact-detail', { id, firstName, lastName, age, photo, mode: 'edit' })}
                  >
                    <View style={styles.card}>
                      {photo ? (
                        <Image
                          alt=""
                          resizeMode="cover"
                          source={{ uri: photo }}
                          style={styles.cardImg} />
                      ) : (
                        <View style={[styles.cardImg, styles.cardAvatar]}>
                          <Text style={styles.cardAvatarText}>{firstName}</Text>
                        </View>
                      )}
                      <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>{firstName} {lastName}</Text>
                        <Text style={styles.cardPhone}>{age}</Text>
                      </View>
                      <View style={styles.cardAction}>
                        <Feather
                          color="#9ca3af"
                          name="chevron-right"
                          size={22} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  sectionItems: {
    marginTop: 8,
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: '#d6d6d6',
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
  cardAction: {
    paddingRight: 16,
  },
});
