import firebaseConfig from "./db.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const listaDePresentes = document.querySelector("#list");
const enviarDadosbtn = document.getElementById("enviarDados");
console.log(listaDePresentes);
//ler do banco de dados (firestore) e atualizar a lista, apenas os presentes que não foram comprados
const q = query(collection(db, "presentes"), where("checked", "==", false));
const presentes = await getDocs(q);
presentes.forEach((doc) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox" docId=${doc.id} > ${doc.data().productName}
    </label>
  `;
  listaDePresentes.appendChild(li);
  console.log(doc.data());
});
//atualizar o banco de dados (firestore) quando um presente for comprado
async function atualizaDB() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  const name = document.getElementById("personName").value;
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const docId = checkbox.getAttribute("docId");
      const docRef = doc(db, "presentes", docId);
      updateDoc(docRef, {
        checked: true,
        name: name,
      });
    }
  });
}
// adicionar um listener para detectar quando o banco de dados foi atualizado
// e recarregar a página
function addDBUpdateListener() {
  const collectionRef = collection(db, "presentes");
  onSnapshot(collectionRef, () => {
    alert("Obrigado!");
    location.reload();
  });
}
enviarDadosbtn.addEventListener("click", async () => {
  await atualizaDB();
  addDBUpdateListener();
});
