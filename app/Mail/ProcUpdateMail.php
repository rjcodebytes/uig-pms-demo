<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProcUpdateMail extends Mailable
{
    use Queueable, SerializesModels;

    public $emailData;  // Public property to store email data

    /**
     * Create a new message instance.
     *
     * @param array $emailData
     */
    public function __construct($emailData)
    {
        $this->emailData = $emailData;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Procurement Document Update for Initiator')
            ->view('emails.procurement-mailiniupdate') // Initiator-specific template
            ->with('emailData', $this->emailData);
    }
}
