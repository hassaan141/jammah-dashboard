import SelectInput from '../forms/SelectInput'

interface OrganizationTypeSelectProps {
  organizationType: string
  onOrganizationTypeChange: (type: string) => void
}

const ORGANIZATION_TYPES = [
  // Add this placeholder option at the top
  { value: '', label: 'Select organization type' }, 
  { value: 'masjid', label: 'Masjid / Mussalah' },
  { value: 'msa', label: 'MSA' },
  { value: 'islamic-school', label: 'Islamic School' },
  { value: 'sisters-group', label: 'Sisters Group' },
  { value: 'youth-group', label: 'Youth Group' },
  { value: 'book-club', label: 'Book Club' },
  { value: 'book-store', label: 'Book Store' },
  { value: 'run-club', label: 'Run Club' },
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
        // If organizationType is empty, it will show the placeholder
        value={organizationType} 
        onChange={onOrganizationTypeChange}
        options={ORGANIZATION_TYPES}
        required
      />
    </div>
  )
}