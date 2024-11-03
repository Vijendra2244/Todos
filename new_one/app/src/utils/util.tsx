// import { GlobalContext } from "@/contextAPI/GlobalContextProvider";
// import { useContext } from "react";

// const {emailAddressGlobal} = useContext(GlobalContext);

const LocalStorageItem = () => {
   return `Bearer ${localStorage.getItem('access')}`;
}

export default LocalStorageItem