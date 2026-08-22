<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProcurementMail extends Mailable
{
    use Queueable, SerializesModels;

    public $emailData;  // Public property to store email data
    public $recipientType; // To determine which template to use

    /**
     * Create a new message instance.
     *
     * @param array $emailData
     * @param string $recipientType
     */
    public function __construct($emailData, $recipientType)
    {
        $this->emailData = $emailData;
        $this->recipientType = $recipientType;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // Choose the template based on the recipient type
        $template = ($this->recipientType === 'initiator')
            ? 'emails.procurement-mailini'
            : 'emails.procurement-mailhod';
 
        return $this->view($template) // Dynamically select the template
            ->subject('Procurement Document Notification') // Common email subject
            ->with('emailData', $this->emailData); // Pass email data to the template
    }

}
