# ============== Import library ==============
import cgi
import json
import pandas as pd
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split

def predict(waktu, lepas, aktivitas, pendapat):
    # Train the model
    gaussian = GaussianNB()
    gaussian.fit(x_train, y_train)

    # Transform input data into an array
    input_data = [waktu, lepas, aktivitas, pendapat]
    Y_pred = gaussian.predict([input_data])

    return int(Y_pred[0])

if __name__ == "__main__":
    form = cgi.FieldStorage()

    # Retrieve data from the form
    waktu = int(form.getvalue("waktu-hiburan"))
    lepas = int(form.getvalue("lepas-gadget"))
    aktivitas = int(form.getvalue("aktivitas-lain"))
    pendapat = int(form.getvalue("pendapat-orang"))
    
    # Load the dataset
    data = pd.read_csv("Ketergantungan Gadget.csv")
    data = data.drop(columns=['Timestamp',
                          'Email Address',
                          'Nama'])
    
    #Pengecekan dan Penanganan Outlier
    for i in data:
        if data[i].dtypes in ['int64', 'float64']:      # Membuat kondisi untuk memilih kolom bertipe int64 dan float64

            Q1 = data[i].quantile(0.25)                 # Mencari nilai kuartil 1
            Q3 = data[i].quantile(0.75)                 # Mencari nilai kuartil 3
        
            IQR = Q3 - Q1                               # Menghitung nilai IQR

            min_IQR = Q1 - 1.5 * IQR                    # Menghitung nilai minimum IQR
            max_IQR = Q3 + 1.5 * IQR                    # Menghitung nilai maksimum IQR

            low_outliers = data[(data[i] < min_IQR)]    # Membuat kondisi untuk mencari low outlier
            high_outliers = data[(data[i] > max_IQR)]   # Membuat kondisi untuk mencari high outlier

            if not low_outliers.empty:  # Menampilkan indeks low outlier
                data.loc[low_outliers.index, i] = min_IQR                 # Menggantikan low outlier dengan min_IQR

            if not high_outliers.empty:  # Menampilkan indeks high outlier
                data.loc[high_outliers.index, i] = max_IQR                # Menggantikan high outlier dengan max_IQR

    # Feature engineering and transforming categorical variables to numerical
    data['Jenis Kelamin'] = data['Jenis Kelamin'].replace({'Laki-Laki': 1, 'Perempuan': 0})
    data['penggunaan_gadget'] = data['penggunaan_gadget'].replace({'Bermain game': 1, 'Menjelajah media sosial': 2, 'Menonton video atau streaming': 3,
                                                                'Browsing web': 4, 'Pekerjaan': 5, 'Semua diatas': 5, 'berkomunikasi dengan orang lain': 5,
                                                                'Menonton Youtube': 5, 'Membaca novel dan komik': 5})
    data['indikasi_kecanduan'] = data['indikasi_kecanduan'].replace({'Iya': 1, 'Tidak': 0})

    x = data.loc[:, ['waktu_hiburan', 'aktivitas_lain', 'lepas_gadget', 'pendapat_orang']]
    y = data[['indikasi_kecanduan']]

    # Split the data into training and testing sets
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=0)

    # Make a prediction
    prediction = predict(waktu, lepas, aktivitas, pendapat)

    # Send the prediction as a JSON response
    
    response_data = {"prediction": int(prediction)}
    print("Content-type: application/json\n")
    print(json.dumps(response_data))
