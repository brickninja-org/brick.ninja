'use client';

import type { FC } from 'react';
import type { TranslationId } from '@/lib/translate';

import { useCallback, useMemo, useState } from 'react';

import { Language } from '@brickninja-org/database';
import { isTruthy } from '@brickninja-org/helper/is';
import { Dialog } from '@brickninja-org/ui/components/dialog/Dialog';
import { Textarea } from '@brickninja-org/ui/components/form/Textarea';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { Button } from '@/components/button';
import { Code } from '@/components/layout/code';

export interface TranslationEditorProps {
  dictionaries: {
    de: Partial<Record<TranslationId, string>>,
    en: Partial<Record<TranslationId, string>>,
    es: Partial<Record<TranslationId, string>>,
    fr: Partial<Record<TranslationId, string>>,
    nl: Partial<Record<TranslationId, string>>,
  },
}

export const TranslationEditor: FC<TranslationEditorProps> = ({ dictionaries }) => {
  const keys = Object.keys(dictionaries.en) as TranslationId[];

  const [changes, setChanges] = useState<Record<Language, Partial<Record<TranslationId, string>>>>({ de: {}, en: {}, es: {}, fr: {}, nl: {}});
  const [edit, setEdit] = useState<{ language: Language, key: TranslationId, value: string }>();

  const handleExport = useCallback((language: Language) => {
    const json = JSON.stringify(
      Object.fromEntries(
        keys.map((id) => [id, changes[language][id] ?? dictionaries[language][id]])
      ),
      null,
      2,
    );

    const download = document.createElement('a');
    download.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(json + '\n')}`);
    download.setAttribute('download', `${language}.json`);
    document.body.append(download);
    download.click();
    download.remove();
  }, [changes, dictionaries, keys]);

  const suggestions = useMemo(() => edit?.key
    ? Array.from(new Set([
        ...Object.entries(dictionaries.de).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.de[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(dictionaries.en).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.en[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(dictionaries.es).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.es[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(dictionaries.fr).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.fr[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(dictionaries.nl).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.nl[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => dictionaries[edit.language][id as TranslationId]),
        ...Object.entries(changes.de).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.de[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(changes.en).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.en[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(changes.es).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.es[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(changes.fr).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.fr[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
        ...Object.entries(changes.nl).filter(([id, value]) => id !== edit.key && (value === dictionaries.en[edit.key] || value === changes.nl[edit.key] || (edit.value.length > 2 && value.startsWith(edit.value)))).map(([id]) => changes[edit.language][id as TranslationId]),
      ].filter(isTruthy)))
    : [],
  [changes, dictionaries, edit],
  );

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Key</Table.HeaderCell>
            <Table.HeaderCell>English</Table.HeaderCell>
            <Table.HeaderCell>Dutch</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-100">
            <th/>
            <th><Button variant="primary" onPress={() => handleExport('de')}>Export</Button></th>
            <th><Button variant="primary" onPress={() => handleExport('en')}>Export</Button></th>
            <th><Button variant="primary" onPress={() => handleExport('es')}>Export</Button></th>
            <th><Button variant="primary" onPress={() => handleExport('fr')}>Export</Button></th>
            <th><Button variant="primary" onPress={() => handleExport('nl')}>Export</Button></th>
          </tr>
          {keys.map((key) => (
            <tr key={key}>
              <th><Code inline borderless>{key}</Code></th>
              <td><TranslationButton language="de" id={key} dictionaries={dictionaries} changes={changes} editAction={setEdit}/></td>
              <td><TranslationButton language="en" id={key} dictionaries={dictionaries} changes={changes} editAction={setEdit}/></td>
              <td><TranslationButton language="es" id={key} dictionaries={dictionaries} changes={changes} editAction={setEdit}/></td>
              <td><TranslationButton language="fr" id={key} dictionaries={dictionaries} changes={changes} editAction={setEdit}/></td>
              <td><TranslationButton language="nl" id={key} dictionaries={dictionaries} changes={changes} editAction={setEdit}/></td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog open={!!edit} title={`Edit "${edit?.key}" (${edit?.language})`} onClose={() => setEdit(undefined)}>
        {edit && (
          <MenuList>
            <Textarea value={edit.value} onChange={(value) => setEdit({ ...edit, value })} autoFocus/>
            <div className="flex mt-2">
              <Button onPress={() => { setChanges({ ...changes, [edit.language]: { ...changes[edit.language], [edit.key]: edit.value === '' || edit.value === dictionaries[edit.language][edit.key] ? undefined : edit.value }}); setEdit(undefined); }} flex>Save</Button>
            </div>
            {suggestions.length > 0 && (
              <>
                <div className="m-4 font-medium">Suggestions</div>
                {suggestions.map((suggestion) => (
                  <Button key={suggestion} variant="ghost" onPress={() => setEdit({ ...edit, value: suggestion })}>{suggestion}</Button>
                ))}
              </>
            )}
          </MenuList>
        )}
      </Dialog>
    </>
  );
};

export interface TranslationButtonProps {
  language: Language,
  id: TranslationId,
  dictionaries: Record<Language, Partial<Record<TranslationId, string>>>,
  changes: Record<Language, Partial<Record<TranslationId, string>>>,
  editAction: (edit: { language: Language, key: TranslationId, value: string }) => void,
}

export const TranslationButton: FC<TranslationButtonProps> = ({ language, id, dictionaries, changes, editAction }) => {
  // const isChanged = changes[language][id] !== undefined;
  // const isFallback = !isChanged && dictionaries[language][id] !== undefined;

  return (
    <Button variant="ghost" isIconOnly onPress={() => editAction({ language, key: id, value: changes[language][id] ?? dictionaries[language][id] ?? '' })} className="block w-[calc(100%_+_32px)]">
      <div className="max-w-[calc((100vw_-_700px)_/_4)] min-w-[200px] overflow-hidden text-ellipsis">
        <span className="">
          {changes[language][id] ?? dictionaries[language][id] ?? dictionaries.en[id]}
        </span>
      </div>
    </Button>
  );
};
