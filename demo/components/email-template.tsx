import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>{"Ndugu mteja, SamakiSamaki tunashukuru kwa maoni yako"}</h1>
  </div>
);
