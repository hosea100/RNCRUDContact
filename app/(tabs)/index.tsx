import { 
  Image, 
  StyleSheet,
  View, 
  ActivityIndicator, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { Feather } from '@expo/vector-icons';

import axiosInstance from '@/utils/axiosInstance';

type ErrorType = {
  message: string
}

type ContactType = {
  firstName: string
  lastName: string
  age: string
  photo: string
  id: string
}

export default function HomeScreen() {
  const [contactData, setContactData] = useState<ContactType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorType | null>(null)

  useEffect(() => {
    axiosInstance.getRequest('https://contact.herokuapp.com/contact',
    {
      headers: {}
    }).then(data => {
      setContactData(data?.data)
      setLoading(false)
    }).catch(err => {
      setError(err)
      setLoading(false)
    })
  }, [contactData])

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
    }, {} as Record<string, ContactType[]>);

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
    <SafeAreaView style={{ backgroundColor: '#f2f2f2' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Contacts</Text>
        </View>
        {sections.map(({ letter, items }) => (
          <View style={styles.section} key={letter}>
            <Text style={styles.sectionTitle}>{letter}</Text>
            <View style={styles.sectionItems}>
              {items.map(({ photo, firstName, lastName, age }, index) => {
                return (
                  <View key={index} style={styles.cardWrapper}>
                    <TouchableOpacity
                      onPress={() => {
                        // handle onPress
                      }}>
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
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Section */
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
  /** Card */
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



