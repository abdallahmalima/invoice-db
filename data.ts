import  callProducts  from "./db";

export async function fetchProducts() {

try {

const response = await callProducts("SELECT * FROM test", []);


const data = JSON.stringify(response);

return data;

}

catch (error) {

console.log(error);

throw new Error("Failed to fetch revenue data.");

}

}


export async function insertProducts(data:any) {
    try {
      const response = await callProducts("INSERT INTO test (name,image) values (?,?)", data);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to insert products.");
    }
  }

  export async function deleteProducts(data:any) {
    try {
      const response = await callProducts("DELETE FROM test WHERE name=?", data);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to insert products.");
    }
  }
  