import logo from './logo.svg';
import './App.css';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import MeetingsInfo from './components/MeetingsInfo';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = "a123gjhgjsdf6576";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      token
    }
  }
});

const errorLink = onError(({graphqlErrors, networkError})=>{
  if(graphqlErrors) {
    graphqlErrors.map(({message, location, path})=>{
      console.warn(`GraphQl error ${message}`)
    })
  }
})
const link = from([
  errorLink,
  new HttpLink({uri:"http://smart-meeting.herokuapp.com"})
]);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link)
});

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="main-section">
      <MeetingsInfo/>
    </div>
    </ApolloProvider>
  );
}

export default App;
