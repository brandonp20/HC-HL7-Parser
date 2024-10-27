import React, { useState } from 'react';
import './HL7MapperSimple.css';

function HL7MapperSimple() {
  const [hl7Input, setHl7Input] = useState('');
  const [edsId, setEdsId] = useState('');
  const [segments, setSegments] = useState([]);
  const [mappings, setMappings] = useState({});
  const [showEmpty, setShowEmpty] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // HL7 standard mappings
  const standardMappings = {
    // Patient Demographics
    'PTlastname': { segment: 'PID', field: '5', component: '1', description: 'Patient Last Name - PID-5.1' },
    'PTfirstname': { segment: 'PID', field: '5', component: '2', description: 'Patient First Name - PID-5.2' },
    'PTmrn': { segment: 'PID', field: '3', component: '0', description: 'Medical Record Number - PID-3' },
    'PTacctnum': { segment: 'PID', field: '18', component: '0', description: 'Patient Account Number - PID-18' },
    'PTdob': { segment: 'PID', field: '7', component: '0', description: 'Date of Birth - PID-7' },
    'PTgender': { segment: 'PID', field: '8', component: '0', description: 'Gender - PID-8' },
    'PTSSN': { segment: 'PID', field: '19', component: '0', description: 'Social Security Number - PID-19' },
  
    // Patient Location
    'PTroom': { segment: 'PV1', field: '3', component: '2', description: 'Patient Room - PV1-3.2' },
    'PTfloor': { segment: 'PV1', field: '3', component: '1', description: 'Patient Floor - PV1-3.1' },
    'PTbed': { segment: 'PV1', field: '3', component: '3', description: 'Patient Bed - PV1-3.3' },
  
    // Patient Address
    'PTaddress1': { segment: 'PID', field: '11', component: '1', description: 'Street Address - PID-11.1' },
    'PTaddress2': { segment: 'PID', field: '11', component: '2', description: 'Additional Address - PID-11.2' },
    'PTcity': { segment: 'PID', field: '11', component: '3', description: 'City - PID-11.3' },
    'PTstate': { segment: 'PID', field: '11', component: '4', description: 'State - PID-11.4' },
    'PTzip': { segment: 'PID', field: '11', component: '5', description: 'Zip Code - PID-11.5' },
    'PTphone': { segment: 'PID', field: '13', component: '0', description: 'Phone Number - PID-13' },
  
    // Visit Information
    'PVadmitdate': { segment: 'PV1', field: '44', component: '0', description: 'Admit Date/Time - PV1-44' },
    'PVstatus': { segment: 'PV1', field: '2', component: '0', description: 'Patient Class - PV1-2' },
    'PVfacility': { segment: 'PV1', field: '3', component: '0', description: 'Assigned Patient Location - PV1-3' },
    'PVattendingNPI': { segment: 'PV1', field: '7', component: '1', description: 'Attending Doctor - PV1-7.1' },
    'PVreferringNPI': { segment: 'PV1', field: '8', component: '1', description: 'Referring Doctor - PV1-8.1' },
    'PVconsultingNPI': { segment: 'PV1', field: '9', component: '1', description: 'Consulting Doctor - PV1-9.1' },
  
    // Insurance 1 Information
    'IN1carrier': { segment: 'IN1', field: '4', component: '0', description: 'Insurance Company Name - IN1-4' },
    'IN1address1': { segment: 'IN1', field: '5', component: '1', description: 'Insurance Company Address - IN1-5.1' },
    'IN1address2': { segment: 'IN1', field: '5', component: '2', description: 'Insurance Company Address 2 - IN1-5.2' },
    'IN1city': { segment: 'IN1', field: '5', component: '3', description: 'Insurance Company City - IN1-5.3' },
    'IN1state': { segment: 'IN1', field: '5', component: '4', description: 'Insurance Company State - IN1-5.4' },
    'IN1zip': { segment: 'IN1', field: '5', component: '5', description: 'Insurance Company Zip - IN1-5.5' },
    'IN1phone': { segment: 'IN1', field: '7', component: '0', description: 'Insurance Company Phone - IN1-7' },
  
    // Guarantor 1 Information
    'GT1first': { segment: 'GT1', field: '3', component: '2', description: 'Guarantor First Name - GT1-3.2' },
    'GT1last': { segment: 'GT1', field: '3', component: '1', description: 'Guarantor Last Name - GT1-3.1' },
    'GT1dob': { segment: 'GT1', field: '8', component: '0', description: 'Guarantor Date of Birth - GT1-8' },
    'GT1address1': { segment: 'GT1', field: '5', component: '1', description: 'Guarantor Address - GT1-5.1' },
    'GT1address2': { segment: 'GT1', field: '5', component: '2', description: 'Guarantor Address 2 - GT1-5.2' },
    'GT1city': { segment: 'GT1', field: '5', component: '3', description: 'Guarantor City - GT1-5.3' },
    'GT1state': { segment: 'GT1', field: '5', component: '4', description: 'Guarantor State - GT1-5.4' },
    'GT1zip': { segment: 'GT1', field: '5', component: '5', description: 'Guarantor Zip - GT1-5.5' },
    'GT1phone': { segment: 'GT1', field: '6', component: '0', description: 'Guarantor Phone - GT1-6' },
    'GT1policy': { segment: 'GT1', field: '16', component: '0', description: 'Guarantor Policy Number - GT1-16' },
    'GT1group': { segment: 'GT1', field: '17', component: '0', description: 'Guarantor Group Number - GT1-17' },
    'GT1auth': { segment: 'GT1', field: '21', component: '0', description: 'Guarantor Authorization Code - GT1-21' },
  
    // Insurance 2 Information
    'IN2carrier': { segment: 'IN2', field: '4', component: '0', description: 'Insurance 2 Company Name - IN2-4' },
    'IN2address1': { segment: 'IN2', field: '5', component: '1', description: 'Insurance 2 Company Address - IN2-5.1' },
    'IN2address2': { segment: 'IN2', field: '5', component: '2', description: 'Insurance 2 Company Address 2 - IN2-5.2' },
    'IN2city': { segment: 'IN2', field: '5', component: '3', description: 'Insurance 2 Company City - IN2-5.3' },
    'IN2state': { segment: 'IN2', field: '5', component: '4', description: 'Insurance 2 Company State - IN2-5.4' },
    'IN2zip': { segment: 'IN2', field: '5', component: '5', description: 'Insurance 2 Company Zip - IN2-5.5' },
    'IN2phone': { segment: 'IN2', field: '7', component: '0', description: 'Insurance 2 Company Phone - IN2-7' },
  
    // Guarantor 2 Information
    'GT2first': { segment: 'GT1', field: '3', component: '2', description: 'Guarantor 2 First Name - GT1(2)-3.2', sequence: '2' },
    'GT2last': { segment: 'GT1', field: '3', component: '1', description: 'Guarantor 2 Last Name - GT1(2)-3.1', sequence: '2' },
    'GT2dob': { segment: 'GT1', field: '8', component: '0', description: 'Guarantor 2 Date of Birth - GT1(2)-8', sequence: '2' },
    'GT2address1': { segment: 'GT1', field: '5', component: '1', description: 'Guarantor 2 Address - GT1(2)-5.1', sequence: '2' },
    'GT2address2': { segment: 'GT1', field: '5', component: '2', description: 'Guarantor 2 Address 2 - GT1(2)-5.2', sequence: '2' },
    'GT2city': { segment: 'GT1', field: '5', component: '3', description: 'Guarantor 2 City - GT1(2)-5.3', sequence: '2' },
    'GT2state': { segment: 'GT1', field: '5', component: '4', description: 'Guarantor 2 State - GT1(2)-5.4', sequence: '2' },
    'GT2zip': { segment: 'GT1', field: '5', component: '5', description: 'Guarantor 2 Zip - GT1(2)-5.5', sequence: '2' },
    'GT2phone': { segment: 'GT1', field: '6', component: '0', description: 'Guarantor 2 Phone - GT1(2)-6', sequence: '2' },
    'GT2policy': { segment: 'GT1', field: '16', component: '0', description: 'Guarantor 2 Policy Number - GT1(2)-16', sequence: '2' },
    'GT2group': { segment: 'GT1', field: '17', component: '0', description: 'Guarantor 2 Group Number - GT1(2)-17', sequence: '2' },
    'GT2auth': { segment: 'GT1', field: '21', component: '0', description: 'Guarantor 2 Authorization Code - GT1(2)-21', sequence: '2' }
  };
  
  // Available Slots
  const slots = {
    'Patient Demographics': [
      'PTacctnum',
      'PTmrn',
      'PTlastname',
      'PTfirstname',
      'PTdob',
      'PTgender',
      'PTSSN'
    ],
    'Patient Location': [
      'PTroom',
      'PTfloor',
      'PTbed'
    ],
    'Patient Address': [
      'PTaddress1',
      'PTaddress2',
      'PTcity',
      'PTstate',
      'PTzip',
      'PTphone'
    ],
    'Visit Information': [
      'PVadmitdate',
      'PVstatus',
      'PVfacility',
      'PVattendingNPI',
      'PVreferringNPI',
      'PVconsultingNPI'
    ],
    'Primary Insurance': [
      'IN1carrier',
      'IN1address1',
      'IN1address2',
      'IN1city',
      'IN1state',
      'IN1zip',
      'IN1phone'
    ],
    'Primary Guarantor': [
      'GT1first',
      'GT1last',
      'GT1dob',
      'GT1address1',
      'GT1address2',
      'GT1city',
      'GT1state',
      'GT1zip',
      'GT1phone',
      'GT1policy',
      'GT1group',
      'GT1auth'
    ],
    'Secondary Insurance': [
      'IN2carrier',
      'IN2address1',
      'IN2address2',
      'IN2city',
      'IN2state',
      'IN2zip',
      'IN2phone'
    ],
    'Secondary Guarantor': [
      'GT2first',
      'GT2last',
      'GT2dob',
      'GT2address1',
      'GT2address2',
      'GT2city',
      'GT2state',
      'GT2zip',
      'GT2phone',
      'GT2policy',
      'GT2group',
      'GT2auth'
    ]
  };

  // Maps the HybridChart slot to the HL7 Standard 
  const autoFillCategoryRecommended = (categorySlots) => {
    categorySlots.forEach(slot => {
      if (standardMappings[slot]) {
        const mapping = standardMappings[slot];
        const recommendedValue = `${mapping.segment}|${mapping.field}|${mapping.component || '0'}`;
        handleMapping(slot, recommendedValue);
      }
    });
  };

  // Parses field components
  const parseFieldComponents = (field) => {
    if (!field) return [];
    
    // Split field into repetitions by tilde
    const repetitions = field.split('~').map(rep => rep.trim());
    
    // For each repetition, split into components by carets
    return repetitions.map(repetition => {
      const components = repetition.split('^').map(comp => comp.trim());
      return {
        components,
        raw: repetition
      };
    });
  };

  // HL7 Parsing
  const parseHL7 = () => {
    if (!hl7Input.trim()) {
      alert('Please enter an HL7 message');
      return;
    }
  
    // Parses by segment and tracks repeated segments
    try {
      const lines = hl7Input.split('\n').filter(line => line.trim());
      const segmentCounts = {};
      
      const parsed = lines.map(line => {
        const [segmentType, ...fields] = line.split('|');
        
        // Track sequence for each segment type
        segmentCounts[segmentType] = (segmentCounts[segmentType] || 0) + 1;
        
        const parsedFields = fields.map((field, index) => {
          const parsedData = parseFieldComponents(field);
          return {
            raw: field,
            repetitions: parsedData,
            index: index + 1,
            hasMultipleRepetitions: parsedData.length > 1
          };
        });
  
        return {
          segmentType,
          sequence: segmentCounts[segmentType], // Add sequence number
          fields: parsedFields,
          raw: line
        };
      });
      
      setSegments(parsed);
    } catch (error) {
      alert('Error parsing HL7 message');
      console.error('Parsing error:', error);
    }
  };
  
  // Lists all possible selection options from parsed HL7
  // Handles multiple segment instances (GT1(1) vs GT(2))
  // Handles repetitions (~) and components (^)
  const getFilteredOptions = () => {
    // processes each segment in the message
    return segments.flatMap((segment) => 
        // processes each field in the segment
      segment.fields.flatMap((field) => {
        // Splits the fields into repetitions (~)
        const repetitions = field.raw.split('~');
        // processes each repetition
        return repetitions.flatMap((repetition, repIndex) => {
            // splits repetitions into components (^)
          const components = repetition.split('^');
          
          // handles multiple guarantor segments
          const sequenceLabel = segment.segmentType === 'GT1' && segment.sequence > 1 
            ? `(${segment.sequence})` 
            : '';
          
            // below only applies if there are multiple components (contains '^')
          if (components.length > 1) {
            // creates a selection option for each component
            return components.map((component, compIdx) => ({
              value: `${segment.segmentType}|${field.index}|${compIdx + 1}|${repIndex + 1}|${segment.sequence}`,
              label: `${segment.segmentType}${sequenceLabel}[${field.index}]${repetitions.length > 1 ? ` (Rep ${repIndex + 1})` : ''}.${compIdx + 1}: ${component}`,
              isEmpty: !component.trim(),
              sequence: segment.sequence
            }));
          }
          
          // the below occurs if field has no components (does not contain '^')
          return [{
            value: `${segment.segmentType}|${field.index}|0|${repIndex + 1}|${segment.sequence}`,
            label: `${segment.segmentType}${sequenceLabel}[${field.index}]${repetitions.length > 1 ? ` (Rep ${repIndex + 1})` : ''}: ${repetition}`,
            isEmpty: !repetition.trim(),
            sequence: segment.sequence
          }];
        });
      })
    ).filter(option => showEmpty || !option.isEmpty);
  };
  
  // handle adding and removing user mapping selections 
  const handleMapping = (slot, value) => {
    // removes mapping
    if (!value) {
      setMappings(prev => {
        const newMappings = { ...prev };
        delete newMappings[slot];
        return newMappings;
      });
      return;
    }
    // splits value into it's components
    const [segment, field, component, repetition, sequence] = value.split('|');
    setMappings(prev => ({
      ...prev,
      [slot]: { 
        segment, 
        field, 
        component,
        repetition: repetition || '1',
        sequence: sequence || '1'
      }
    }));
  };
  
  // Retrieves the actual value from the HL7 based on the mapped segment
  const parseValue = (mapping, segments) => {
    // retrieves segment
    const segment = segments.find(seg => 
      seg.segmentType === mapping.segment && 
      seg.sequence === parseInt(mapping.sequence || '1')
    );
    if (!segment) return '';
  
    // retrieves field
    const field = segment.fields[mapping.field - 1];
    if (!field) return '';
  
    // splits fields into repetitions if applicable
    const repetitions = field.raw.split('~');
    const repetition = repetitions[mapping.repetition - 1] || '';
    
    // if no splits, then returns 0
    if (mapping.component === '0') return repetition;
    
    // if there are splits, then returns the specified one
    const components = repetition.split('^');
    return components[mapping.component - 1] || '';
  };

  // Checks if option matches standard mapping for adding 'Recommended' to option
  const isStandardMapping = (slot, option) => {
    if (!showSuggestions || !standardMappings[slot]) return false;
    const [segment, field, component] = option.value.split('|');
    const standard = standardMappings[slot];
    return segment === standard.segment && 
           field === standard.field && 
           component === standard.component;
  };

  // Exports to CSV
  const exportToCSV = () => {
    const headers = ['Slot Name', 'HL7 Location', 'Header Instance', 'Field', 'Repetition', 'Component', 'Value'];
    
    const rows = Object.entries(mappings)
      .filter(([_, value]) => value && value.segment)
      .map(([slot, mapping]) => {
        const segmentData = segments.filter(seg => seg.segmentType === mapping.segment);
        const headerInstance = segmentData.length > 1 ? 
          (standardMappings[slot]?.sequence || '1') : '1';
        
        const segmentInstance = segmentData[headerInstance - 1];
        const fieldData = segmentInstance?.fields[mapping.field - 1];
        
        let value = '';
        const repetition = mapping.repetition || '1';
        const component = mapping.component || '1';
        
        if (fieldData) {
          const repData = fieldData.repetitions[repetition - 1];
          if (repData) {
            if (component !== '0') {
              value = repData.components[component - 1] || '';
            } else {
              value = repData.raw;
            }
          }
        }
        
        const hl7Location = `${mapping.segment}-${mapping.field}${repetition !== '1' ? '[' + repetition + ']' : ''}${component !== '0' ? '.' + component : ''}`;
        value = value.includes(',') ? `"${value}"` : value;
        
        return `${slot},${hl7Location},${headerInstance},${mapping.field},${repetition},${component},${value}`;
      });
    
    if (rows.length === 0) {
      alert('No mappings to export');
      return;
    }
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hl7-mappings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Exports to JSON
  const exportToJSON = () => {
    const filteredMappings = Object.entries(mappings)
      .filter(([_, value]) => value && value.segment)
      .reduce((acc, [slot, mapping]) => {
        const segmentData = segments.filter(seg => seg.segmentType === mapping.segment);
        const headerInstance = segmentData.length > 1 ? 
          (standardMappings[slot]?.sequence || '1') : '1';
        
        const segmentInstance = segmentData[headerInstance - 1];
        const fieldData = segmentInstance?.fields[mapping.field - 1];
        
        let value = '';
        let repetition = '1';
        let component = mapping.component || '1';
        
        if (fieldData) {
          const repetitions = fieldData.raw.split('~');
          if (repetitions.length > 1) {
            repetitions.forEach((rep, repIndex) => {
              const components = rep.split('^');
              if (components.length > 1) {
                value = components[parseInt(component) - 1] || '';
              } else {
                value = rep;
              }
            });
          } else {
            const components = fieldData.raw.split('^');
            if (components.length > 1) {
              value = components[parseInt(component) - 1] || '';
            } else {
              value = fieldData.raw;
            }
          }
        }
        
        // Format the HL7 location in standard notation
        const hl7Location = `${mapping.segment}-${mapping.field}${repetition !== '1' ? '.' + repetition : ''}${component !== '1' ? '.' + component : ''}`;
        
        acc[slot] = {
          hl7Location,
          header: mapping.segment,
          headerInstance,
          field: mapping.field,
          repetition,
          component,
          value
        };
        
        return acc;
      }, {});
    
    const exportData = {
      mappings: filteredMappings,
      timestamp: new Date().toISOString(),
      totalMappings: Object.keys(filteredMappings).length
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hl7-mappings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToSQL = () => {
    if (!edsId) {
      alert('Please enter an EDS ID');
      return;
    }
  
    const sqlStatements = Object.entries(mappings)
      .filter(([_, value]) => value && value.segment)
      .map(([slot, mapping]) => {
        // For date detection
        const isDate = slot.toLowerCase().includes('date') || 
                      slot.toLowerCase().includes('dob') || 
                      (mapping.segment === 'PID' && mapping.field === '7');
  
        // Handle caret/tilde logic
        let caretValue = mapping.component;
        let tildeValue = mapping.repetition || '1';
        
        // If tilde is 0, caret must be 0
        if (tildeValue === '0') {
          caretValue = '0';
        }
        // Default to 1 if not explicitly set to 0
        if (caretValue !== '0') {
          caretValue = caretValue || '1';
        }
        if (tildeValue !== '0') {
          tildeValue = tildeValue || '1';
        }
  
        return `INSERT INTO [dbo].[extdata_format]
             ([edformat_eds_id]
             ,[edformat_field]
             ,[edformat_header]
             ,[edformat_occurrence]
             ,[edformat_slot]
             ,[edformat_tilde]
             ,[edformat_caret]
             ,[edformat_isdate])
       VALUES
             (${edsId}
             ,'${slot}'
             ,'${mapping.segment}'
             ,${mapping.sequence || 1}
             ,${mapping.field}
             ,${tildeValue}
             ,${caretValue}
             ,${isDate ? 1 : 0})`;
      }).join(';\n\n');
  
    if (!sqlStatements) {
      alert('No mappings to export');
      return;
    }
  
    const blob = new Blob([sqlStatements], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hl7-mappings.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  // below is the HTML for the UI
  return (
    <div className="mapper">
      <h1>HybridChart HL7 Mapper</h1>
      
      <div className="input-area">
        <textarea
          value={hl7Input}
          onChange={(e) => setHl7Input(e.target.value)}
          placeholder="Paste HL7 message here..."
        />
        <div className="control-row">
          <button onClick={parseHL7}>Parse Message</button>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showEmpty}
                onChange={(e) => setShowEmpty(e.target.checked)}
              />
              Allow Empty Segment Selection
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showSuggestions}
                onChange={(e) => setShowSuggestions(e.target.checked)}
              />
              Recommend HL7 Standard Suggestions
            </label>
          </div>
        </div>
      </div>

      {segments.length > 0 && (
        <div className="mapping-area">
          {Object.entries(slots).map(([category, categorySlots]) => (
            <div key={category} className="category">
              <div className="category-header">
                <h2>{category}</h2>
                <button 
                  onClick={() => autoFillCategoryRecommended(categorySlots)}
                  className="auto-fill-button"
                >
                  Autofill
                </button>
              </div>
              <div className="slots-container">
                {categorySlots.map(slot => (
                  <div key={slot} className="slot-row">
                    <div className="slot-label">
                      {slot}
                      {showSuggestions && standardMappings[slot] && (
                        <div className="suggestion-hint">
                          {standardMappings[slot].description}
                        </div>
                      )}
                    </div>
                    <select
                      value={mappings[slot] ? 
                        `${mappings[slot].segment}|${mappings[slot].field}|${mappings[slot].component || '0'}|${mappings[slot].repetition || '1'}|${mappings[slot].sequence || '1'}` : 
                        ''}
                      onChange={(e) => handleMapping(slot, e.target.value)}
                    >
                      <option value="">Select field</option>
                      {getFilteredOptions().map((option, index) => (
                        <option 
                          key={index}
                          value={option.value}
                          className={isStandardMapping(slot, option) ? 'suggested-mapping' : ''}
                        >
                          {option.label}
                          {isStandardMapping(slot, option) ? ' (Recommended)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Added back the export buttons */}
          <div className="export-buttons">
            <input
                type="number"
                value={edsId}
                onChange={(e) => setEdsId(e.target.value)}
                placeholder="Enter EDS ID"
                className="eds-input"
            />
            <button 
                onClick={exportToJSON}
                className="export-button"
            >
                Export to JSON
            </button>
            <button 
                onClick={exportToCSV}
                className="export-button"
            >
                Export to CSV
            </button>
            <button 
                onClick={exportToSQL}
                className="export-button"
                disabled={!edsId}
            >
                Export to SQL
            </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default HL7MapperSimple;


/* SAMPLE ADT

    MSH|^~\&||COCVT|||202410211516||ADT^A06|VTGTADM.1.16851255|P|2.2||||||||||||||||||||||||||||||||||||||||COCVT

    EVN|A06|202410211516|||PHMH99932^HALL^FELECIA|202410211513

    PID|1||M000306465|M196917|LASTNAME^FIRSTNAME^MIDDLENAME|LAURA|19500221|F|LASTNAME^FIRSTNAME^M|W|99999 YUCAIPA ST^^CALDWELL^ID^83607^USA^^^CN||208-631-8438||ENG|M|COCVT|M00401634094|518-64-5340

    NK1|1|KIRSTINE^JUDY|SI|^^^^^USA|208-989-2118

    PV1|1|I|M.EDH^M.ELD1^A|EM||M.ER|HOGNA^Hogg^Nathanael|.SELF^REFERRED^SELF|STOPA^Stowell^Patrick^D^^^MD~PAYNE^Payne^Brandon|MAS||||PR|WI|N|HOGNA^Hogg^Nathanael^C^^^DO|IN||12|||||||||||||||||||COCVT|SOB X 3 DAYS|ADM|||202410211513

    PV2|1|SP

    DG1|1|I10|J44.9|CHRONIC OBSTRUCTIVE PULMONARY DISEASE, U||A||||||||||||N

    GT1|1||LASTNAME^FIRSTNAME^MIDDLENAME||14240 YUCAIPA ST^^CALDWELL^ID^83607^USA^^^CN|208-631-8438||19500221|F||SA|518-64-5340|||RETIRED|||||R|||||||||||||||||||||||||||||010112

    GT1|2||OBENDORF^JOHN^S||14240 YUCAIPA ST^^CALDWELL^ID^83607^USA^^^CN|208-631-8438||19531119|M||SP|518621101|||SELF EMPLOYED||2086318852|||S|||||||||||||||||||||||||||||REALTOR

    IN1|1|TRUEBLUE||TRUE BLUE MCR HMO|PO BOX 8406^^BOISE^ID^83707^USA||208-286-3656|30000001|MEDICARE ADVANTAGE|||20240101||||OBENDORF^REBECCA^L|01|19500221||||||||||||||||||XMM101082964|||||||F

    ZIN|1|SP|TRUE BLUE-HEALTH VENTURES|Y|20241021|PARA.AUTO||Y|||||TRUEBLUE|VERIFIED|20241021|100%

*/