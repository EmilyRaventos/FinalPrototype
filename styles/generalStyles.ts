import { StyleSheet } from 'react-native';

const colors = {
  primary: '#008000', 
  remove: '#ff6347', 
  white: '#ffffff',
  gray: '#808080', 
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
    marginBottom: 10, // Add spacing between habit items
    backgroundColor: '#f9f9f9', 
    borderRadius: 5,
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
    marginTop: 5,
    fontSize: 16,
    color: '#666', // Color for the details text
  },
});

export default generalStyles;
