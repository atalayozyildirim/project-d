# Project-D CRM backend servisi

## Kurulum

1. Projeyi klonlayın:
    ```bash
    git clone 
    cd project-d
    ```

2. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

3. [.env](http://_vscodecontentref_/0) dosyasını oluşturun ve gerekli çevresel değişkenleri ekleyin:
    ```properties
    MODE=Development
    SECRET_KEY=your_secret_key
    MONGO_URI=mongodb://localhost:27017/project
    JWT_SECRET=your_jwt_secret_key
    ```

4. Docker kullanarak MongoDB'yi başlatın:
    ```bash
    docker pull mongo
    docker run -d -p 27017:27017 --name my-mongo mongo
    ```

5. Sunucuyu başlatın:
    ```bash
    npm run dev
    ```

## Routes

### Auth Routes

- **POST api/auth/login**
    - Açıklama: Kullanıcı girişi yapar.
    - Body:
        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```

- **POST api/auth/register**
    - Açıklama: Yeni kullanıcı kaydı yapar.
    - Body:
        ```json
        {
          "name": "John Doe",
          "email": "john@example.com",
          "password": "password123"
        }
        ```

### User Routes

- **GET api/user/all**
    - Açıklama: Tüm kullanıcıları listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına kullanıcı sayısı (varsayılan: 10)

- **POST api/user/add**
    - Açıklama: Yeni kullanıcı ekler.
    - Body:
        ```json
        {
          "name": "Jane Doe",
          "email": "jane@example.com",
          "password": "password123"
        }
        ```

- **DELETE api/user/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip kullanıcıyı siler.
    - Params:
        - `id`: Kullanıcı ID'si

### Employer Routes

- **GET api/emp/all**
    - Açıklama: Tüm işverenleri listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına işveren sayısı (varsayılan: 10)

- **POST api/emp/add**
    - Açıklama: Yeni işveren ekler.
    - Body:
        ```json
        {
          "name": "Company ABC",
          "email": "contact@companyabc.com",
          "phone": "1234567890",
          "address": "123 Street, City"
        }
        ```

- **DELETE api/emp/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip işvereni siler.
    - Params:
        - `id`: İşveren ID'si

### Customer Routes

- **GET api/customer/all**
    - Açıklama: Tüm müşterileri listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına müşteri sayısı (varsayılan: 10)

- **POST api/customer/add**
    - Açıklama: Yeni müşteri ekler.
    - Body:
        ```json
        {
          "name": "Customer XYZ",
          "email": "customer@xyz.com",
          "company": "XYZ Ltd.",
          "phone": "0987654321",
          "address": "456 Avenue, City"
        }
        ```

- **DELETE api/customer/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip müşteriyi siler.
    - Params:
        - `id`: Müşteri ID'si

### Invoice Routes

- **GET api/invoice/all**
    - Açıklama: Tüm faturaları listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına fatura sayısı (varsayılan: 10)

- **POST api/invoice/add**
    - Açıklama: Yeni fatura ekler.
    - Body:
        ```json
        {
          "customer": "Customer XYZ",
          "amount": 1000,
          "dueDate": "2025-03-15"
        }
        ```

- **DELETE api/invoice/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip faturayı siler.
    - Params:
        - `id`: Fatura ID'si

## Mail Servisi

### Mail Routes
 - (/:id)  Belirtilen kullanıcının Id degerine gore mail servisi için config verilerini ceker
- **GET api/mail/inbox/:id**
  - Açıklama: Inbox'taki tüm mailleri listeler.
  - Response:

        ```json
        [
          {
            "subject": "Mail Subject",
            "from": "sender@example.com",
            "date": "2025-03-04T12:34:56.789Z",
            "text": "Mail content"
          },
          ...
        ]
        ```

- **POST api/mail/add**
  - Açıklama: Yeni mail sunucusu bilgisi ekler.
  - Body:

        ```json
        {
          "userId": "user_id",
          "user": "user@example.com",
          "password": "password123",
          "host": "smtp.example.com",
          "port": 587,
          "from": "from@example.com"
        }
        ```

- **GET api/mail/getEmail/:id**
  - Açıklama: Belirtilen ID'ye sahip mail sunucusu bilgilerini getirir.
  - Params:
    - `id`: Mail sunucusu bilgisi ID'si
  - Response:

        ```json
        {
          "userId": "user_id",
          "user": "user@example.com",
          "password": "password123",
          "host": "smtp.example.com",
          "port": 587,
          "from": "from@example.com"
        }
        ```

- **DELETE api/mail/delete/:id**
  - Açıklama: Belirtilen ID'ye sahip mail sunucusu bilgilerini siler.
  - Params:
    - `id`: Mail sunucusu bilgisi ID'si

- **POST api/mail/sendMail**
  - Açıklama: E-posta gönderir.
  - Body:

        ```json
        {
          "to": "recipient@example.com",
          "subject": "Mail Subject",
          "text": "Mail content"
        }
        ```

- **PATCH api/mail/update/:id**
  - Açıklama: Belirtilen ID'ye sahip mail sunucusu bilgilerini günceller.
  - Params:
    - `id`: Mail sunucusu bilgisi ID'si
  - Body:

        ```json
        {
          "user": "newuser@example.com",
          "password": "newpassword",
          "host": "newhost",
          "port": 993,
          "from": "newfrom@example.com"
        }
        ```

## Chart Servisi

### Chart Routes

- **GET api/chart/total**
  - Açıklama: Toplam fatura, müşteri ve işveren sayısını getirir.
  - Response:

        ```json
        {
          "totalInvoices": 100,
          "totalCustomers": 50,
          "totalEmployers": 20
        }
        ```

- **GET api/chart/totalInvoices**
  - Açıklama: Tüm faturaların toplam [total](http://_vscodecontentref_/1) değerini getirir.
  - Response:

        ```json
        {
          "totalAmount": 50000
        }
        ```

- **GET api/chart/totalInvoicesByMonth**
  - Açıklama: Faturaları aylık olarak gruplandırır ve her ayın toplam [total](http://_vscodecontentref_/2) değerini getirir.
  - Response:

        ```json
        [
          {
            "_id": 1,
            "totalAmount": 10000
          },
          {
            "_id": 2,
            "totalAmount": 15000
          },
          ...
        ]
        ```

  - Not: [_id](http://_vscodecontentref_/3) alanı, ayı temsil eder (1: Ocak, 2: Şubat, vb.).

- **GET api/chart/total/sales**
  - Açıklama: Tüm çalışanların toplam maaşını getirir.
  - Response:

        ```json
        {
          "totalSalary": 200000
        }
        ```

### Örnek Kullanım

#### Toplam Fatura, Müşteri ve İşveren Sayısını Getirme

```bash
curl -X GET http://localhost:3000/api/chart/total 
```
## Middleware

- **currentUser**
    - Açıklama: Geçerli kullanıcıyı doğrular ve kullanıcı bilgilerini request objesine ekler.

## Modeller

### AuthModel

- **name**: String, required
- **email**: String, required, unique
- **password**: String, required
- **token**: String, 
optional- **role**: String, optional, default: "user"

### CustomerModel

- **name**: String, required
- **email**: String, required, unique
- **company**: String, required
- **phone**: String, required
- **address**: String, required
- **createdAt**: Date, default: Date.now
- **updatedAt**: Date, default: Date.now

## Util

### generateJWT

- Açıklama: Kullanıcı ID'si ile JWT oluşturur.
- Parametreler: `userId`
- Dönüş: Promise (token)

### generateRefreshToken

- Açıklama: Kullanıcı ID'si ile refresh token oluşturur.
- Parametreler: `userId`
- Dönüş: Promise (token)

### Author

## Atalay Özyıldırım