// import * as CryptoJS from "crypto-js";
const root = document.querySelector("#root");
let objectTV = {};
let sharedKeyObject = [];
let defaultValue = [];
let checkBox = [];
let banMa = "";
const app = {
  shared_key: function () {
    if (Object.keys(objectTV).length < 9) return false;
    if (sharedKeyObject.length !== 5) {
      const { a1, a2, tv1, tv2, tv3, tv4, tv5, p, k } = objectTV;
      defaultValue.splice(0, 0, tv1, tv2, tv3, tv4, tv5);
      const m1 = a2 * tv1 ** 2 + a1 * tv1 + k;
      const m2 = a2 * tv2 ** 2 + a1 * tv2 + k;
      const m3 = a2 * tv3 ** 2 + a1 * tv3 + k;
      const m4 = a2 * tv4 ** 2 + a1 * tv4 + k;
      const m5 = a2 * tv5 ** 2 + a1 * tv5 + k;

      sharedKeyObject.splice(0, 0, m1, m2, m3, m4, m5);
    } else {
      return;
    }
  },
  restore_key: function () {
    if (sharedKeyObject.length <= 0) {
      // chưa chia sẻ khóa
      Toastify({
        text: "Chưa chia sẻ khóa",
        className: "btn-warning",
        backgroundColor: "red",
      }).showToast();
      checkBox = [];
      return;
    } else if (checkBox.length < 3) {
      checkBox = [];
      Toastify({
        text: "Phải chọn ít nhất là 3 thành viên để khôi phục khóa",
        className: "btn-warning",
        backgroundColor: "red",
      }).showToast();
      return;
      // phải chọn ít nhất là 3 thành viên để khôi phục khóa
    } else {
      let lst_manh = [];
      let lst_b = [];
      let lst_v = [];
      let lst_index = [];

      for (let i = 0; i < checkBox.length; i++) {
        if (checkBox[i] == 1) {
          lst_index.push(i + 1);
        }
      }

      for (let i of lst_index) {
        if (i === 1) {
          lst_manh.push(sharedKeyObject[i - 1]);
          lst_v.push(parseInt(defaultValue[i - 1]));
        } else if (i === 2) {
          lst_manh.push(sharedKeyObject[i - 1]);
          lst_v.push(parseInt(defaultValue[i - 1]));
        } else if (i === 3) {
          lst_manh.push(sharedKeyObject[i - 1]);
          lst_v.push(parseInt(defaultValue[i - 1]));
        } else if (i === 4) {
          lst_manh.push(sharedKeyObject[i - 1]);
          lst_v.push(parseInt(defaultValue[i - 1]));
        } else {
          lst_manh.push(sharedKeyObject[i - 1]);
          lst_v.push(parseInt(defaultValue[i - 1]));
        }
      }

      for (let i = 0; i < lst_v.length; i++) {
        let lst_temp = [...lst_v];
        lst_temp.splice(i, 1);
        let b = 1;
        for (let j of lst_temp) {
          b *= j / (j - lst_v[i]);
        }
        lst_b.push(b);
      }

      let k = 0;
      for (let i = 0; i < lst_manh.length; i++) {
        k += lst_b[i] * lst_manh[i];
      }
      k = Math.ceil(k);

      const filterValue = checkBox?.filter((value, index) => +value === 1);
      if (k && filterValue?.length >= 3) {
        Toastify({
          text: "Khôi phục khóa thành công",
          className: "btn-success",
          backgroundColor: "green",
        }).showToast();
      } else {
        Toastify({
          text: "Khôi phục khóa không thành công do thành viên được chọn nhỏ hơn 3",
          className: "btn-error",
          backgroundColor: "red",
        }).showToast();
        checkBox = [];
        return 0;
      }
      checkBox = [];
      return k;
    }
  },
  desEncryptFunction: function (key, plaintext) {
    const cipher = CryptoJS.DES.encrypt(
      plaintext,
      CryptoJS.enc.Utf8.parse(key),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    if (cipher.toString()) {
      Toastify({
        text: "Mã hóa thành công",
        className: "btn-success",
        backgroundColor: "green",
      }).showToast();
    }
    return cipher.toString();
  },
  desDecrypt: function (key, ciphertext) {
    const decipher = CryptoJS.DES.decrypt(
      ciphertext,
      CryptoJS.enc.Utf8.parse(key),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decipher.toString(CryptoJS.enc.Utf8);
  },
  random: function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },
  formEncode: function (header = false) {
    if (header === true) {
      root.innerHTML = `<div class="header">
                <button class="header-encode active">Đầu gửi</button>
                <button class="header-decode">Đầu nhận</button>
            </div>
            <div class="container"></div>`;
    }
    const container = root.querySelector(".container");
    // render ra form mã hóa
    container.innerHTML = `
            <div class="form-encode">
                    <form class="encode-form">
                        <h3 style='font-size: 20px; font-weight: bold'>Nhập các giá trị</h3>
                        <!-- Nhập các giá trị thành phần gồm p , a1, a2, và các thành viên 1 ,2 ,3, 4 ,5 -->
                        <div class="value">
                            <div>
                                <label for="p-value">p:</label>
                                <input id="p-value" class="p-value w-[100px]" />
                            </div>
    
                            <div>
                                <label for="a1-value">a1:</label>
                                <input id="a1-value" class="a1-value" />
                            </div>
    
                            <div>
                                <label for="a2-value">a2:</label>
                                <input id="a2-value" class="a2-value" />
                            </div>
    
                            <div>
                                <label for="tv1-value">Thành viên 1:</label>
                                <input id="tv1-value" class="tv1-value" />
                            </div>
    
                            <div>
                                <label for="tv2-value">Thành viên 2:</label>
                                <input id="tv2-value" class="tv2-value" />
                            </div>
                            <div>
                                <label for="tv3-value">Thành viên 3:</label>
                                <input id="tv3-value" class="tv3-value" />
                            </div>
    
                            <div>
                                <label for="tv4-value">Thành viên 4:</label>
                                <input id="tv4-value" class="tv4-value" />
                            </div>
    
                            <div>
                                <label for="tv5-value">Thành viên 5:</label>
                                <input id="tv5-value" class="tv5-value" />
                            </div>
    
                            </div>
                            
                            <div class="div-btn-create"><button class="create-value-random">
                                Tạo ngẫu nhiên
                            </button></div>
    
                        <!-- tạo khóa bí mật -->
                        <div class="key-secret">
                        <label for="key-encode">Khóa bí mật:</label>
                        <input id="key-encode" class="key-encode" />
                        <button class="btn-create-key">Tạo ngẫu nhiên</button>
                        </div>

                        <!-- Nơi nhập bản rõ và hiện thị bản mã -->
                        <div class="visible-content">
                            <div class="input-plain">
                                <div>
                                <label for="int-plain">Nhập bản rõ:</label>
                                <input class="file-open" type="file">Chọn file</input>
                                </div>
                                <textarea
                                    id="int-plain"
                                    cols="30"
                                    rows="7"
                                ></textarea>
                            </div>
                            <div class="output-code">
                                <label for="out-code">Bản mã:</label>
                                <textarea
                                    cols="30"
                                    rows="7"
                                    id="out-code"
                                ></textarea>
                            </div>
                        </div>
    
                        <!-- Các hoạt động nhấn nút -->
                        <div class="action">
                            <!-- Chia sẻ khóa -->
                            <button class="shared-key">Chia sẻ khóa</button>
    
                            <!-- Mã hóa -->
                            <button class="encode-button">Mã hóa</button>
                        </div>
                    </form>
                </div>
        `;

    const fileOpen = document.querySelector("input.file-open");
    fileOpen.addEventListener("change", (event) => {
      // Lấy danh sách các tệp được chọn
      const files = event.target.files;

      // Duyệt qua danh sách các tệp
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Đọc nội dung của file dưới dạng text
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const intPlain = document.querySelector("#int-plain");
          intPlain.value = event.target.result;
        };
        fileReader.readAsText(file);
      }
    });

    // Nếu nhấn nút sẽ tự động sinh các giá trị và điền vào các ô input
    const btnCreateValue = container.querySelector(".create-value-random");
    btnCreateValue.addEventListener("click", (e) => {
      e.preventDefault();

      const pValue = document.getElementById("p-value");
      pValue.value = this.random(50, 100);
      objectTV.p = +pValue.value;

      const a1Value = document.getElementById("a1-value");
      a1Value.value = this.random(1, pValue.value);
      objectTV.a1 = +a1Value.value;

      const a2Value = document.getElementById("a2-value");
      a2Value.value = this.random(1, pValue.value);
      objectTV.a2 = +a2Value.value;

      const tv1Value = document.getElementById("tv1-value");
      tv1Value.value = this.random(10, 200);
      objectTV.tv1 = +tv1Value.value;

      const tv2Value = document.getElementById("tv2-value");
      tv2Value.value = this.random(10, 200);
      objectTV.tv2 = +tv2Value.value;

      const tv3Value = document.getElementById("tv3-value");
      tv3Value.value = this.random(10, 200);
      objectTV.tv3 = +tv3Value.value;

      const tv4Value = document.getElementById("tv4-value");
      tv4Value.value = this.random(10, 200);
      objectTV.tv4 = +tv4Value.value;

      const tv5Value = document.getElementById("tv5-value");
      tv5Value.value = this.random(10, 200);
      objectTV.tv5 = +tv5Value.value;
    });

    // Nếu nhấn nút sẽ tự động sinh khóa và điền vào các ô input
    const btnCreateKey = container.querySelector(".btn-create-key");
    btnCreateKey.addEventListener("click", (e) => {
      e.preventDefault();
      const keyEncodeInput = document.getElementById("key-encode");
      keyEncodeInput.value = this.random(10000000, 99999999);
      objectTV.k = +keyEncodeInput.value;
      Toastify({
        text: "Tạo ngẫu nhiên khóa thành công",
        className: "btn-success",
        backgroundColor: "green",
      }).showToast();
    });

    // Nhấn để chia sẻ key từ bên đầu gửi sang đầu nhận
    const btnSharedKey = document.querySelector(".action .shared-key");
    btnSharedKey.addEventListener("click", (e) => {
      e.preventDefault();
      this.shared_key();
      Toastify({
        text: "Chia sẻ khóa thành công",
        className: "btn-success",
        backgroundColor: "green",
      }).showToast();
    });

    const btnEncode = document.querySelector(".encode-button");
    const textAreaInput = document.getElementById("int-plain");
    const textAreaOutput = document.getElementById("out-code");
    btnEncode.addEventListener("click", (e) => {
      e.preventDefault();
      const pValue = document.getElementById("p-value");
      objectTV.p = +pValue.value;

      const a1Value = document.getElementById("a1-value");
      objectTV.a1 = +a1Value.value;

      const a2Value = document.getElementById("a2-value");
      objectTV.a2 = +a2Value.value;

      const tv1Value = document.getElementById("tv1-value");
      objectTV.tv1 = +tv1Value.value;

      const tv2Value = document.getElementById("tv2-value");
      objectTV.tv2 = +tv2Value.value;

      const tv3Value = document.getElementById("tv3-value");
      objectTV.tv3 = +tv3Value.value;

      const tv4Value = document.getElementById("tv4-value");
      objectTV.tv4 = +tv4Value.value;

      const tv5Value = document.getElementById("tv5-value");
      objectTV.tv5 = +tv5Value.value;

      const keyEncodeInput = document.getElementById("key-encode");
      objectTV.k = +keyEncodeInput.value;
      this.shared_key();
      const textDecode = this.desEncryptFunction(
        objectTV.k,
        textAreaInput.value
      );
      textAreaOutput.value = textDecode;
      banMa = textAreaOutput.value;
    });
  },
  formDecode: function () {
    const container = root.querySelector(".container");
    // render ra form giải mã
    container.innerHTML = `<div class="form-decode">
                    <h3 style="font-size: 20px;text-align:center; font-weight: bold">Chọn 3 thành viên để khôi phục khóa</h3>
                    <div class="value-piece-key d-flex justify-content-center">
                        <span class="" style="margin-right: 20px;white-space: nowrap">Giá trị mảnh khóa =></span>
                        <div class="info-key-people d-flex justify-content-center">
                           <div class="people-1" style="white-space: nowrap">Thành viên 1: ${
                             sharedKeyObject[0] ?? ""
                           }</div>
                            <div class="people-2" style="white-space: nowrap">Thành viên 2: ${
                              sharedKeyObject[1] ?? ""
                            }</div>
                            <div class="people-3" style="white-space: nowrap">Thành viên 3: ${
                              sharedKeyObject[2] ?? ""
                            }</div>
                            <div class="people-4" style="white-space: nowrap">Thành viên 4: ${
                              sharedKeyObject[3] ?? ""
                            }</div>
                            <div class="people-5" style="white-space: nowrap">Thành viên 5: ${
                              sharedKeyObject[4] ?? ""
                            }</div>
                        </div> 
                    </div>
                    <form class="decode-form">
                        <div class="chose-tv">
                            <div class="tv">
                                <input id="tv-1" type="checkbox" name="tv-1"/>
                                <label for="tv-1">Thành viên 1</label>
                            </div>
        
                            <div class="tv">
                                <input id="tv-2" type="checkbox" name="tv-2"/>
                                <label for="tv-2">Thành viên 2</label>
                            </div>
        
                            <div class="tv">
                                <input id="tv-3" type="checkbox" name="tv-3"/>
                                <label for="tv-3">Thành viên 3</label>
                            </div>
        
                            <div class="tv">
                                <input id="tv-4" type="checkbox" name="tv-4"/>
                                <label for="tv-4">Thành viên 4</label>
                            </div>
        
                            <div class="tv">
                                <input id="tv-5" type="checkbox" name="tv-5"/>
                                <label for="tv-5">Thành viên 5</label>
                            </div>
                            <button id="btn-update-key" class="btn-update-key">Khôi phục khóa</button>
                        </div>
                    </form>
                        <div class="key-secret">
                            <label for="key-decode">Khóa bí mật:</label>
                            <input id="key-decode" class="key-decode" />
                        </div>
        
                        <div class="visible-content">
                            <div class="input-code">
                                <label for="int-code">Nhập bản mã:</label>
                                <textarea
                                    id="int-code"
                                    cols="30"
                                    rows="7"
                                ></textarea>
                            </div>
                            <div class="output-plain">
                                <label for="out-plain">Bản rõ:</label>
                                <textarea
                                    cols="30"
                                    rows="7"
                                    id="out-plain"
                                ></textarea>
                            </div>
                        </div>
    
                        <div class="action">
                            <button class="encode-btn">Giải mã</button>
                        </div>
                    
                </div>`;
    const intCode = document.querySelector(".input-code #int-code");
    if (banMa) {
      intCode.value = banMa;
    }
    const formDecode = document.querySelector("form.decode-form");
    formDecode.addEventListener("submit", (e) => {
      e.preventDefault(); // Ngăn chặn hành động mặc định của form

      // lấy giá trị của các thẻ input
      formDecode.querySelectorAll("input").forEach((value, index) => {
        checkBox.push(value.checked ? 1 : 0);
      });
      const key = this.restore_key();

      const keySecret = document.querySelector(".key-secret #key-decode");
      keySecret.value = key;
    });
    const buttonEncode = document.querySelector(".encode-btn");

    buttonEncode.addEventListener("click", (e) => {
      e.preventDefault();
      const keySecret = document.querySelector(".key-secret #key-decode");
      const key = keySecret.value;
      const code = document.getElementById("int-code").value;
      const outPlaint = document.querySelector("#out-plain");
      console.log(key, code);
      const decode = this.desDecrypt(key, code);
      outPlaint.value = decode;
    });
  },
  start: function () {
    this.formEncode(true);
    const header = root.querySelector(".header");
    header.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("header-encode") &&
        !e.target.classList.contains("active")
      ) {
        e.target.classList.add("active");
        e.target.nextElementSibling.classList.remove("active");
        this.formEncode();
        objectTV = {};
        sharedKeyObject = [];
        defaultValue = [];
        checkBox = [];
        banMa = "";
      } else if (
        e.target.classList.contains("header-decode") &&
        !e.target.classList.contains("active")
      ) {
        e.target.classList.add("active");
        e.target.previousElementSibling.classList.remove("active");
        this.formDecode();
      }
    });
  },
};

app.start();
