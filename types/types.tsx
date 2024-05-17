
export type RootStackParamList = {
  ErrorType: {
    message: string
  }
  
  ContactType: {
    firstName: string
    lastName: string
    age: string
    photo: string
    id: string
  }

  ContactDetail: {
    firstName: string
    lastName: string
    age: string
    photo: string
    id: string
    mode: 'add' | 'edit'
  }

  Home: {
    firstName: string
    lastName: string
    age: string
    photo: string
    id: string
  }
}
