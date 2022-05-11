import {
  getApiResponseResults,
} from '$util/helpers';

import _ from 'lodash';
import {FieldTypes} from "../enums";
import {getFieldAttributes} from "../util/helpers";
import createUrl from "../api/createUrl";

/**
 * Get plotApplication list results
 * @param {Object} plotApplication
 * @return {Object[]}
 */
export const getContentPlotApplicationsListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((plotApplication) => getContentApplicationListItem(plotApplication));

/**
 * Get plotApplication list item
 * @param {Object} application
 * @return {Object}
 */
export const getContentApplicationListItem = (plotApplication: Object): Object => {
  return {
    id: plotApplication.id,
    plot_search: plotApplication.plot_search,
    applicant: plotApplication.applicant,
    plot_search_type: plotApplication.plot_search_type,
    plot_search_subtype: plotApplication.plot_search_subtype,
    target_identifier: plotApplication.targets.map(target => target.identifier),
    target_address: plotApplication.targets.map(target => target.address.address),
    target_reserved: plotApplication.targets.map(target => target.reserved),
  };
};

export const reshapeSavedApplicationObject = (application, form, formAttributes, attachments) => {
  const getEmptySection = () => ({
    sections: {},
    fields: {}
  });

  const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');

  const result = getEmptySection();

  const reshapeSingleSectionData = (section, answersNode) => {
    const data = getEmptySection();

    section.subsections.forEach((subsection) => {
      reshapeArrayOrSingleSection(subsection, data, answersNode);
    });

    section.fields.forEach((field) => {
      let { value, extra_value } = answersNode.fields[field.identifier] || {};

      switch (fieldTypes.find((fieldType) => fieldType.value === field.type)?.display_name) {
        case 'radiobutton':
        case 'radiobuttoninline':
          value = value !== null && value !== undefined ? value : null;
          break;
        case 'checkbox':
        case 'dropdown':
          if (!field.choices) {
            value = value !== null && value !== undefined ? value : null;
          }
          break;
        case 'uploadfiles':
          extra_value = '';
          value = attachments.filter((attachment) => attachment.field === field.identifier);
          break;
      }

      data.fields[field.identifier] = {
        value,
        extra_value
      };
    })

    return data;
  }

  const reshapeArrayOrSingleSection = (section, parentResultNode, answersNode) => {
    if (section.add_new_allowed) {
      parentResultNode.sections[section.identifier] = [];

      const sectionAnswers = _.transform(answersNode, (acc, item, key) => {
        const match = new RegExp(`^${_.escapeRegExp(section.identifier)}\\[(\\d+)]$`).exec(key);

        if (!match) {
          return acc;
        }

        acc[Number(match[1])] = item;
        return acc;
      }, []).filter((item) => item !== undefined);

      sectionAnswers.forEach((answer) => {
        parentResultNode.sections[section.identifier].push(reshapeSingleSectionData(section, answer))
      });


    } else {
      parentResultNode.sections[section.identifier] = getEmptySection();

      const sectionAnswers = answersNode[section.identifier];

      if (sectionAnswers) {
        parentResultNode.sections[section.identifier] = reshapeSingleSectionData(section, sectionAnswers);
      }
    }
  };

  form.sections.forEach((section) => reshapeArrayOrSingleSection(section, result, application));
  return result;
};

export const getAttachmentLink = (id) => createUrl(`attachment/${id}/download/`);
