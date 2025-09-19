import TransactionForm from '../Components/Transaction/index.jsx'
import Header from '../Layouts/Header.jsx';
import Footer from '../Layouts/Footer'

const TransactionPage = () => {
  return (
    <>
    <Header />
    <TransactionForm />
    <Footer/>
    </>
  );
};

export default TransactionPage;