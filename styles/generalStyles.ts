import { StyleSheet } from 'react-native';

const colors = {
  primary: '#008000', 
  remove: '#ff6347', 
  white: '#ffffff',
  gray: '#808080', 
  green: 'green',
};

const generalStyles = StyleSheet.create({
  // Menu
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10, // Ensure it appears above other content
  },
  menuButtonText: {
    fontSize: 30, // Adjust size for visibility
  },
  menuPanel: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    fontSize: 24,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 10,
    color: 'blue', // Change as needed
  },

  // General container style
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  
  // Header styles
  header: {
    fontSize: 26, 
    fontWeight: 'bold', 
    marginVertical: 20,
    marginLeft: 10,
    justifyContent: 'flex-start',
  },

  // Custom button styles
  removeButton: {
    backgroundColor: colors.remove, 
    justifyContent: 'center',
    alignItems: 'center',
    width: 100, 
    height: '100%',
  },

  removeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  
  completedButton: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },

  completedButtonText: {
    color: 'white',
    fontSize: 16,
  },

  centeredButtonContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 16, 
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },

  buttonText: {
    color: colors.white,
    textAlign: 'center',
  },

  // Home page - habit list
  habitContainer: {
    backgroundColor: 'white', 
    padding: 10,
  },

  habitHeader: {
    flexDirection: 'row', // Align title and arrow in a row
    justifyContent: 'space-between', // Space between title and arrow
    alignItems: 'center', // Center vertically
  },

  habitTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  arrow: {
    fontSize: 24,
  },
  habitDetails: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginTop: 5,
    fontSize: 16,
    color: '#666'
  },
  habitDetailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },

  // home page
  home_header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8', // Adjust as needed
    elevation: 2, // Add shadow effect on Android
  },
  home_title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  headerButton: {
    backgroundColor: '#4CAF50', // Green background
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2, // For subtle shadow effect (Android)
    shadowColor: '#000', // For shadow effect (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export { generalStyles, colors };
