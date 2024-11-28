import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, onChildAdded, onChildChanged, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const currentUrl = window.location.href;
const idDevice = new URLSearchParams(window.location.search).get('id');

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
const id_st = document.getElementById("st_id");


var energy11;
var energy10;
let tier_6;
let fee;

onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
      avtUser1.src = snapshot.val();
    });
    nameuser1.innerHTML = user.displayName;
    console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val(); // Các thiết bị của người dùng
      if (devices && devices[idDevice]) { // Kiểm thiết bị có tồn tại không
        id_st.innerText = "ID: " + idDevice + " - " + `${devices[idDevice]}`;
        handleIdDeviceUpdate(idDevice); //cập nhật thông tin thiết bị
      } else {
        alert("Device not found.");
      }
    });
  }
});

function handleIdDeviceUpdate(value) {
  // console.log(value);
  // const energy11Ref = ref(database, `${Id_device}/Energy_11`);
  // onValue(energy11Ref, (snapshot) => {
  //   energy11 = snapshot.val();
  // });

//   const energy10rRef = ref(database, `${Id_device}/Energy_10`);
//   onValue(energy10rRef, (snapshot) => {
//     energy10 = snapshot.val();
//     handleIdDeviceUpdate(Id_device,energy11,energy10);
//   });

//   if (typeof energy10 !== 'undefined' && typeof energy11 !== 'undefined') {
//     var total = energy10 - energy11;

//     // console.log(total)
//     document.getElementById('total').value = total;
    
    const tier_6Ref = ref(database, `${value}/tier_6`);
    onValue(tier_6Ref, (snapshot) => {
      const tier_6 = snapshot.val();
      console.log(tier_6);

      const feeRef = ref(database, `${value}/fee`);
      onValue(feeRef, (snapshot) => {
        const fee = snapshot.val();
        console.log(fee);

        const Orders1 = [
          {
            productNumber: '--',
            paymentStatus: fee,
            current: tier_6,
          }
        ];

        let a = 'All';
        Orders1.forEach(order => {
            const tr = document.createElement('tr');
            const trContent = `
                <td>${a}</td>
                <td>${order.productNumber}</td>
                <td>${order.paymentStatus}</td>
                <td>${order.current}</td>
            `;
            // a++;
            tr.innerHTML = trContent;
            document.querySelector('table tbody').appendChild(tr);
        });
      });
    });
    
    var tol_money
    const cal_money = document.getElementById('cal_total')
    cal_money.addEventListener('click', function() {
      tol_money =  tier_6*4000;
      document.getElementById('total_m').value = format_m(tol_money);
    });

  // }
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {
    window.location.replace("login_en.html")
  }
});

// var userRead =  sessionStorage.getItem('userses') || localStorage.getItem('user');
// if (userRead === null) {
//     try {
//         auth.signOut();
//     }
//     catch(error){
//         console.error(error);
//       };
// }

var userRead = sessionStorage.getItem('userses') || localStorage.getItem('user');
if (userRead === null) {
    try {
        auth.signOut();
        window.location.replace("login_en.html"); // Chuyển hướng trở lại trang đăng nhập
    } catch(error) {
        console.error(error);
    }
}




