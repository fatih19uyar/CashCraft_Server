export const activationTemplate = (code: string) => {
  return `
      <body>
          <div class="container">
              <div class="header">
                  <h1>Aktivasyon Kodu</h1>
              </div>
              <div class="content">
                  <p>Merhaba,</p>
                  <p>Hesabınızı etkinleştirmek için aşağıdaki aktivasyon kodunu kullanabilirsiniz:</p>
                  <p><strong>Aktivasyon Kodu:</strong> ${code}</p> 
                  <p>Teşekkür ederiz.</p>
                  <p>Saygılarımla,<br>Idvlabs Ekibi</p>
              </div>
          </div>
      </body>
    `;
};
export const resetTemplate = (code: string) => {
  return `
        <body>
            <div class="container">
                <div class="header">
                    <h1>Email Şifre Resetleme Kodu</h1>
                </div>
                <div class="content">
                    <p>Merhaba,</p>
                    <p>Hesabınızı şifersini sıfırlamka için aşağıdaki aktivasyon kodunu kullanabilirsiniz:</p>
                    <p><strong>Aktivasyon Kodu:</strong> ${code}</p> 
                    <p>Teşekkür ederiz.</p>
                    <p>Saygılarımla,<br>Idvlabs Ekibi</p>
                </div>
            </div>
        </body>
      `;
};
