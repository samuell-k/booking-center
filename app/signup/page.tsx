import { redirect } from 'next/navigation'

export default function SignUpRedirect() {
  redirect('/auth/register')
}
