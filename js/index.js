function submitForm(event) {
    event.preventDefault();  // Mencegah formulir untuk langsung dikirim
    var predictionImage = document.getElementById("prediction-image");
    var waktu = document.getElementById("waktu-hiburan").value;
    var aktivitas = document.getElementById("aktivitas-lain").value;
    var lepas = document.getElementById("lepas-gadget").value;
    var pendapat = document.getElementById("pendapat-orang").value;

    const validateInputs = () => {
        if (waktu === '') {
            setError(document.getElementById('waktu-hiburan'), 'Isi waktu sesuai keseharian anda');
        } else {
            setSuccess(document.getElementById('waktu-hiburan'));
        }

        if (aktivitas === '') {
            setError(document.getElementById('aktivitas-lain'), 'Email is required');
        } else {
            setSuccess(document.getElementById('aktivitas-lain'));
        }

        if (lepas === '') {
            setError(document.getElementById('lepas-gadget'), 'Major is required');
        } else {
            setSuccess(document.getElementById('lepas-gadget'));
        }

        if (pendapat === '') {
            setError(document.getElementById('pendapat-orang'), 'Please inform what\'s your discomfort');
        } else {
            setSuccess(document.getElementById('pendapat-orang'));
        }
    };
    
    const setError = (element, message) => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    };

    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        if (errorDisplay) {
            errorDisplay.innerText = '';
        }

        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    };

    validateInputs();
    
    const inputElements = document.querySelectorAll('.input-box input, .input-box select');

    let allInputsAreSuccess = true;

    inputElements.forEach(inputElement => {
        const inputControl = inputElement.parentElement;
        if (!inputControl.classList.contains('success')) {
            allInputsAreSuccess = false;
        }
    });

    console.log('All inputs are success:', allInputsAreSuccess);

    if (allInputsAreSuccess) {
        console.log('Submitting form...');

        document.getElementById("myForm").reset();

        const inputElements = document.querySelectorAll('.input-box input, .input-box select');
    
        inputElements.forEach(inputElement => {
            const inputControl = inputElement.parentElement;
            inputControl.classList.remove('success', 'error');
            const errorDisplay = inputControl.querySelector('.error');
            if (errorDisplay) {
                errorDisplay.innerText = '';
            }
        });

        var diri = document.getElementById("diri");
        var prediksi = document.getElementById("prediksi");

        // Clear the content
        diri.innerHTML = "";
        prediksi.innerHTML = "";
        predictionImage.src = "";
        predictionImage.style.display = "none";

        // Array to store labels corresponding to values 1-5
        var labels = ["", "Sangat Jarang", "Jarang", "Biasa saja", "Sering", "Sangat Sering"];

        // Function to map value to label
        function mapValueToLabel(value) {
        return labels[value] || "";
        }

        // Use the mapValueToLabel function to transform the values
        var aktivitasLabel = mapValueToLabel(aktivitas);
        var lepasLabel = mapValueToLabel(lepas);
        var pendapatLabel = mapValueToLabel(pendapat);

        // Print output di frontend
        diri.innerHTML = "Waktu hiburan: " + waktu + " Jam" + "<br />" +
        "Tingkat ketergangguan aktivitas: " + aktivitasLabel + "<br />" +
        "Tingkat kesulitan lepas: " + lepasLabel + "<br />" +
        "Tingkat pendapat orang lain: " + pendapatLabel + "<br />" + "<br />" +
        "<p>Data sedang diolah</p>";

        // Mendapatkan data formulir
        var formData = new FormData();
        formData.append("waktu-hiburan", waktu);
        formData.append("aktivitas-lain", aktivitas);
        formData.append("lepas-gadget", lepas);
        formData.append("pendapat-orang", pendapat);

        // Mengirim permintaan AJAX untuk prediksi
        fetch("/cgi-bin/prediction_script.py", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            
            var predictionMessage = data.prediction === 1
            ? "Kamu terindikasi mengalami kecanduan gadget! Kurangi frekuensi penggunaan gadegetmu"
            : "Indikasi kecanduanmu masih terjaga, pertahankan ya!";

            // Menghapus pesan "Data sedang diolah..."
            diri.lastElementChild.remove();

            // Menampilkan hasil prediksi dengan SweetAlert
            Swal.fire({
                title: 'Hasil Prediksi',
                text: 'Prediksi: ' + predictionMessage,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Menampilkan hasil prediksi di dalam elemen div
           
            prediksi.innerHTML = "Hasil Prediksi: " + predictionMessage;

            predictionImage.style.display = "block";
            predictionImage.src = data.prediction === 1
            ? "/css/pos.jpg"
            : "/css/neg.png";

        })
        .catch(error => {
            console.log("Terjadi kesalahan:", error);

            // Menampilkan pesan kesalahan dengan SweetAlert
            Swal.fire({
                title: 'Error!',
                text: 'Terjadi kesalahan. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });

             // Menampilkan hasil prediksi di dalam elemen div
             document.getElementById("prediksi").innerHTML = "Terjadi Kesalahan, Mohon tunggu dan coba kembali!";
        });
        
    } else {
        console.log('There are inputs with errors. Form not submitted.');
    }

    
    
    // 

}