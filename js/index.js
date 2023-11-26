function submitForm(event) {
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
        
        // Print output di frontend
        document.getElementById("diri").innerHTML = "Waktu hiburan: " + waktu + "<br />" + "Tingkat ketergangguan aktivitas: " + aktivitas + "<br />" + "Tingkat kesulitan lepas: " + lepas + "<br />" + "Tingkat pendapat orang lain: " + pendapat;

        // Mendapatkan data formulir
        var formData = new FormData(event.target);

        // Mengirim permintaan AJAX untuk prediksi
        fetch("/cgi-bin/prediction_script.py", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Menampilkan hasil prediksi dengan SweetAlert
            Swal.fire({
                title: 'Hasil Prediksi',
                text: 'Prediksi: ' + data.prediction,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Menampilkan hasil prediksi di dalam elemen div
            document.getElementById("result-container").innerHTML = "Hasil Prediksi: " + data.prediction;
        })
        .catch(error => {
            console.error("Terjadi kesalahan:", error);

            // Menampilkan pesan kesalahan dengan SweetAlert
            Swal.fire({
                title: 'Error!',
                text: 'Terjadi kesalahan. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
        
        document.getElementById('myForm').submit();
    } else {
        console.log('There are inputs with errors. Form not submitted.');
    }

    
    
    // 

}