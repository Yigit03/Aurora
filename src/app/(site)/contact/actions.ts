"use server"

import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
    fullname: string,
    email: string,
    topic: string,
    message: string,
}

export const sendContactEmail = async (formData: ContactFormData) => {
    try{
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: process.env.CONTACT_RECIEVER_EMAIL!,
            replyTo:formData.email,
            subject:`Yeni Mesaj: ${formData.topic}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Yeni İletişim Mesajı</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                    <td style="padding: 8px; font-weight: bold;">Ad Soyad:</td>
                    <td style="padding: 8px;">${formData.fullname}</td>
                    </tr>
                    <tr>
                    <td style="padding: 8px; font-weight: bold;">E-posta:</td>
                    <td style="padding: 8px;">${formData.email}</td>
                    </tr>
                    <tr>
                    <td style="padding: 8px; font-weight: bold;">Konu:</td>
                    <td style="padding: 8px;">${formData.topic}</td>
                    </tr>
                    <tr>
                    <td style="padding: 8px; font-weight: bold;">Mesaj:</td>
                    <td style="padding: 8px;">${formData.message}</td>
                    </tr>
                </table>
                </div>`
        })
        return { succes: true, message:'Mesajınız başarıyla gönderildi.'}
    }catch(error){
        console.error('Email gönderme hatası', error)
        return {succes: false, message:'Mesaj gönderilemedi, lütfen daha sonra tekrar deneyin!'}
    }
}