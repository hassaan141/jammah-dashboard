import SelectInput from '../forms/SelectInput'
import TextInput from '../forms/TextInput'

interface OrganizationTypeSelectProps {
  organizationType: string
  onOrganizationTypeChange: (type: string) => void
}

const ORGANIZATION_TYPES = [
  { value: 'masjid', label: 'Masjid' },
  { value: 'islamic-school', label: 'Islamic School' },
  { value: 'sisters-group', label: 'Sisters Group' },
  { value: 'youth-group', label: 'Youth Group' },
  { value: 'book-club', label: 'Book Club' },
  { value: 'book-store', label: 'Book Store' },
  { value: 'run-club', label: 'Run Club' },
  // removed 'other' option to match mobile UX
]

export default function OrganizationTypeSelect({
  organizationType,
  onOrganizationTypeChange,
}: OrganizationTypeSelectProps) {
  return (
    <div className="space-y-6">
      <SelectInput
        id="organizationType"
        label="Organization Type"
        value={organizationType}
        onChange={onOrganizationTypeChange}
        options={ORGANIZATION_TYPES}
        required
      />
      
    </div>
  )
}