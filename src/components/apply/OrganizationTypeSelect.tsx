import SelectInput from '../forms/SelectInput'
import TextInput from '../forms/TextInput'

interface OrganizationTypeSelectProps {
  organizationType: string
  organizationTypeOther: string
  onOrganizationTypeChange: (type: string) => void
  onOrganizationTypeOtherChange: (other: string) => void
}

const ORGANIZATION_TYPES = [
  { value: 'masjid', label: 'Masjid' },
  { value: 'islamic-school', label: 'Islamic School' },
  { value: 'sisters-group', label: 'Sisters Group' },
  { value: 'youth-group', label: 'Youth Group' },
  { value: 'book-club', label: 'Book Club' },
  { value: 'book-store', label: 'Book Store' },
  { value: 'run-club', label: 'Run Club' },
  { value: 'other', label: 'Other' }
]

export default function OrganizationTypeSelect({
  organizationType,
  organizationTypeOther,
  onOrganizationTypeChange,
  onOrganizationTypeOtherChange
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
      
      {organizationType === 'other' && (
        <TextInput
          id="organizationTypeOther"
          label="Please specify"
          value={organizationTypeOther}
          onChange={onOrganizationTypeOtherChange}
          placeholder="Describe your organization type"
          required
        />
      )}
    </div>
  )
}