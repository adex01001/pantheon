<?php
/*  Mimir: mahjong games storage
 *  Copyright (C) 2016  o.klimenko aka ctizen
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
namespace Mimir;

require_once __DIR__ . '/../Primitive.php';

/**
 * Class EventPrescriptPrimitive
 *
 * Represents predefined seating script for event and its current status
 * Low-level model with basic CRUD operations and relations
 * @package Mimir
 */
class EventPrescriptPrimitive extends Primitive
{
    protected static $_table = 'event_prescript';

    protected static $_fieldsMapping = [
        'id'            => '_id',
        'event_id'      => '_eventId',
        'script'        => '_script',
        'next_game'     => '_nextGameIndex',
    ];

    protected function _getFieldsTransforms()
    {
        return [
            '_id'              => $this->_integerTransform(),
            '_eventId'         => $this->_integerTransform(),
            '_script'          => $this->_scriptTransform(),
            '_nextGameIndex'   => $this->_integerTransform()
        ];
    }

    protected function _scriptTransform()
    {
        return [
            'serialize' => function ($obj) {
                return $this->_packSession($obj);
            },
            'deserialize' => function ($str) {
                return $this->_unpackSession($str);
            }
        ];
    }

    /**
     * @param string $prescript
     * @return int[][][]
     */
    protected function _unpackSession($prescript)
    {
        $sessions = [];
        foreach (explode("\n\n", $prescript) as $sessionScript) {
            $tables = explode("\n", $sessionScript);
            $sessions []= array_map(function ($table) {
                return array_map('intval', explode('-', $table));
            }, $tables);
        }

        return $sessions;
    }

    /**
     * @param int[][][] $prescriptObj
     * @return string
     */
    protected function _packSession($prescriptObj)
    {
        $sessions = [];
        foreach ($prescriptObj as $sessionObj) {
            $sessions []= implode("\n", array_map(function ($table) {
                return implode('-', $table);
            }, $sessionObj));
        }
        return implode("\n\n", $sessions);
    }

    /**
     * Local id
     * @var int
     */
    protected $_id;
    /**
     * Related event id
     * @var int
     */
    protected $_eventId;
    /**
     * Related event
     * @var EventPrimitive
     */
    protected $_event;
    /**
     * Predefined seating for all sessions:
     *
     * [
     *   session_index => [
     *      table_index => [player_local_id, player_local_id, player_local_id, player_local_id],
     *      ....
     *   ],
     *   ....
     * ]
     * @var int[][][]
     */
    protected $_script;
    /**
     * Index of next game in script
     * @var int
     */
    protected $_nextGameIndex;

    /**
     * Find prescripts by local ids (primary key)
     *
     * @param IDb $db
     * @param int[] $ids
     * @throws \Exception
     * @return EventPrescriptPrimitive[]
     */
    public static function findByEventId(IDb $db, $ids)
    {
        return self::_findBy($db, 'event_id', $ids);
    }

    protected function _create()
    {
        $session = $this->_db->table(self::$_table)->create();
        $success = $this->_save($session);
        if ($success) {
            $this->_id = $this->_db->lastInsertId();
        }

        return $success;
    }

    protected function _deident()
    {
        $this->_id = null;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->_id;
    }

    /**
     * @return int
     */
    public function getEventId()
    {
        return $this->_eventId;
    }

    /**
     * @param int $eventId
     * @return EventPrescriptPrimitive
     */
    public function setEventId($eventId)
    {
        $this->_eventId = $eventId;
        return $this;
    }

    /**
     * @return EventPrimitive
     * @throws EntityNotFoundException
     * @throws \Exception
     */
    public function getEvent()
    {
        if (!$this->_event) {
            $foundEvents = EventPrimitive::findById($this->_db, [$this->_eventId]);
            if (empty($foundEvents)) {
                throw new EntityNotFoundException("Entity EventPrimitive with id#" . $this->_eventId . ' not found in DB');
            }
            $this->_event = $foundEvents[0];
        }
        return $this->_event;
    }

    /**
     * @param EventPrimitive $event
     * @return EventPrescriptPrimitive
     */
    public function setEvent($event)
    {
        $this->_eventId = $event->getId();
        $this->_event = $event;
        return $this;
    }

    /**
     * @return int[][][]
     */
    public function getScript()
    {
        return $this->_script;
    }

    /**
     * @return int[][]
     */
    public function getNextGameSeating()
    {
        return $this->_script[$this->_nextGameIndex];
    }

    /**
     * @param string[] $script
     * @return EventPrescriptPrimitive
     */
    public function setScript($script)
    {
        $this->_script = $script;
        return $this;
    }

    /**
     * @return int
     */
    public function getNextGameIndex()
    {
        return $this->_nextGameIndex;
    }

    /**
     * @param int $nextGameIndex
     * @return EventPrescriptPrimitive
     */
    public function setNextGameIndex($nextGameIndex)
    {
        $this->_nextGameIndex = $nextGameIndex;
        return $this;
    }
}
