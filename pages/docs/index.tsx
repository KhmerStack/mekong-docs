import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { LATEST_VERSION } from '../../lib/versions'

export default function DocsIndex() {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/docs/${LATEST_VERSION}/getting-started`)
  }, [router])
  return null
}
