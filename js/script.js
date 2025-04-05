document.getElementById("productForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const FormData = new FormData(e.target);//collect all form fields
    const Data = object.fromEntries(FormData);//convert to regular object
    console.log(Data);
    try {
        let response = await fetch( response = fetch("http://localhost:1234/add-product") ,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Data),//convert object to json string
        });
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        let result = await response.json();
        console.log(result);
        alert("product added successfully");
        e.target.reset();//clear form
       
    } catch (error) {
        alert("ERRor" +  error.message);
    }
})