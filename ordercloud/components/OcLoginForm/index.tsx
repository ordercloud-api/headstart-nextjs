import { ChangeEvent, FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react';
import login from '../../redux/ocAuth/login';
import { useOcDispatch, useOcSelector } from '../../redux/ocStore';
import styles from './index.module.css';

interface OcLoginFormProps {
  title?: string
  onLoggedIn: () => void
}

const OcLoginForm: FunctionComponent<OcLoginFormProps> = ({
  title = 'Terminals Dashboard Login',
  onLoggedIn,
}) => {
  const dispatch = useOcDispatch()

  const { loading, error, isAnonymous } = useOcSelector((s) => ({
    isAnonymous: s.ocAuth.isAnonymous,
    error: s.ocAuth.error,
    loading: s.ocAuth.loading,
  }))

  const [formValues, setFormValues] = useState({
    identifier: '',
    password: '',
    remember: false,
  })

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, [fieldKey]: e.target.value }))
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, [fieldKey]: !!e.target.checked }))
  }

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      dispatch(
        login({
          username: formValues.identifier,
          password: formValues.password,
          remember: formValues.remember,
        })
      )
    },
    [formValues, dispatch]
  )

  useEffect(() => {
    if (!isAnonymous) {
      onLoggedIn()
    }
  }, [isAnonymous, onLoggedIn])

  return (
    <form name="ocLoginForm" className={styles.login} onSubmit={handleSubmit}>
      <h3 className={styles['login-title']}>{title}</h3>
      {error && <p>{error.message}</p>}
      <div className={styles['login-email']}>
        <div className={styles['form-field']}>
          <label className={styles['form-label']} htmlFor="identifier">
            Email address
          </label>
          <input
            className={styles.input}
            type="text"
            id="identifier"
            name="identifier"
            value={formValues.identifier}
            onChange={handleInputChange('identifier')}
            required
          />
        </div>
      </div>
      <div className={styles['login-password']}>
        <div className={styles['form-field']}>
          <label className={styles['form-label']} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange('password')}
            required
          />
        </div>
      </div>
      <div className={styles['login-actions']}>
        <span className={styles['login-remember']}>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="remember"
            name="remember"
            checked={formValues.remember}
            onChange={handleCheckboxChange('remember')}
          />
          <label className={`${styles['form-label']} ${styles['checkbox-label']}`} htmlFor="remember">
            Remember me
          </label>
        </span>
        <button className={`button button--primary ${styles['login-login']}`} disabled={loading} type="submit">
          Login
        </button>
        </div>
        <hr className={styles['login-splitter']} />
        <div className={styles['login-create-account']}>
          <a href="/">Create an account</a>
        </div>
    </form>
  )
}

export default OcLoginForm
